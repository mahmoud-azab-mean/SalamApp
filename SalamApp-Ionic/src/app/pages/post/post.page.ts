import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as io from 'socket.io-client';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  photoUrl: string = "assets/images/no-photo.png";
  socket: SocketIOClient.Socket;
  post: any;
  constructor(private postService: PostService, private modalController: ModalController, private camera: Camera, private toastController: ToastController, private loadingController: LoadingController) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'write your post first.',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 2000,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  addPost() {
    if (!this.post) {
      this.presentToast();
      return;
    }
    let body;
    if (!this.photoUrl || this.photoUrl === "assets/images/no-photo.png") {
      body = {
        post: this.post
      }
    } else {
      body = {
        post: this.post,
        photo: this.photoUrl
      }
    }
    this.postService.addPost(body).subscribe(
      data => {
        this.post = '';
        this.dismiss();
        this.presentLoading().then(
          data => {
            this.socket.emit('reload', {});
          }
        )
      }
    )
  }

  selectPhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 400,
      targetHeight: 400
    };
    this.camera.getPicture(options).then(
      img => {
        this.photoUrl = 'data:image/jpeg;base64,' + img;
      }
    )
  }

}
