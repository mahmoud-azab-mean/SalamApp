import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import * as io from 'socket.io-client';
import { TokenService } from 'src/app/services/token.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  postForm: FormGroup;
  socketHost: any;
  socket: any;
  user: any;
  myEvent: any;
  url: string;
  showPreloader: boolean;
  constructor(private fb: FormBuilder, private postService: PostService, private tokenService: TokenService, private alertify: AlertifyService) {
    this.socketHost = 'http://localhost:3000';
    this.socket = io(this.socketHost);
  }

  ngOnInit() {
    this.init();
    this.user = this.tokenService.getPayload();
  }
  init() {
    this.postForm = this.fb.group({
      post: ['', Validators.required]
    })
  }

  addPost() {
    let body;
    if (!this.url) {
      body = {
        post: this.postForm.value.post
      }
    } else {
      body = {
        post: this.postForm.value.post,
        photo: this.url
      }
    }
    if (this.postForm.value.post) {
      this.showPreloader = true;
      this.postService.addPost(body).subscribe(
        data => {
          this.socket.emit('reload', {});
          this.postForm.reset();
          this.url = '';
          this.showPreloader = false;
        },
        err => {
          this.alertify.error('error occured while posting');
          this.showPreloader = false;
        }
      )
    } else {
      this.alertify.error('write your post text');
    }
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

}
