import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserService } from 'src/app/services/user.service';
import { TokenService } from 'src/app/services/token.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  myEvent: any;
  url: string;
  showPreloader: boolean;
  user: any;
  photos = [];
  socket: SocketIOClient.Socket;
  constructor(private userService: UserService, private tokenService: TokenService, private alertify: AlertifyService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.getPhotos();
    this.socket.on('reloadPage', () => {
      this.getPhotos();
    })
  }

  //display image of input file
  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = () => {
        if (!event.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
          this.alertify.warning('image should be JPG|JPEG|PNG|GIF');
          this.url = '';
          this.clearFilePath();
        }
        else {
          if (event.target.files[0].size > 1.5 * 1024 * 1024) {
            this.alertify.warning('image should not be more than 1.5mb');
            this.url = '';
            this.clearFilePath();

          } else {
            this.url = reader.result as string;
            this.myEvent = event;
            this.clearFilePath();
          }
        }
      }
    }
  }

  clearFilePath() {
    const filePath = <HTMLInputElement>document.getElementById('upload');
    filePath.value = '';
  }

  uploadPhoto() {
    if (this.url) {
      this.showPreloader = true;
      this.userService.uploadPhoto(this.url).subscribe(
        data => {
          this.socket.emit('reload', {});
          this.showPreloader = false;
          this.url = '';
          this.alertify.success('photo uploaded');
        },
        err => {
          this.showPreloader = false;
          this.alertify.error('photo not uploaded');
        }
      )
    }
  }

  getPhotos() {
    this.userService.getUser(this.user._id).subscribe(
      data => {
        this.photos = data.result.photos
      },
      err => {
        this.alertify.error('photos error')
      }
    );
  }

  setAsProfile(photo) {
    this.userService.SetDefaultPhoto(photo.photoVersion, photo.photoId).subscribe(
      data => {
        this.socket.emit('reload', {});
        this.alertify.success('profile photo set successfully');
      },
      err => {
        this.alertify.error('profile photo set failure');
      }
    );
  }

  deletePhoto(photoId) {
    this.alertify.confirm('do you want to delete photo',
      () => {
        this.userService.deletePhoto(photoId).subscribe(
          data => {
            this.photos.splice(this.photos.findIndex(p => p.photoId === photoId), 1);
            this.alertify.success('photo deleted successfully');
            this.socket.emit('reload', {});
          },
          err => {
            this.alertify.error('photo deleted failure');
          }
        )
      }
    )
  }
}
