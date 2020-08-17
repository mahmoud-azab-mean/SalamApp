import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';
import { PostPage } from '../post/post.page';
@Component({
  selector: 'app-streams',
  templateUrl: './streams.page.html',
  styleUrls: ['./streams.page.scss'],
})
export class StreamsPage implements OnInit {
  posts: string;
  streams = [];
  topStreams = [];
  socket: SocketIOClient.Socket;
  user: any;
  customStyle: string = environment.scrollbarStyle;
  constructor(private postService: PostService, private tokenService: TokenService, private authService: AuthService, private router: Router, public modalController: ModalController) {
    this.socket = io('http://localhost:3000');
    this.posts = 'streams';
  }

  ngOnInit() {
    this.tokenService.getPayload().then(
      user => this.user = user
    );
    this.getPosts();
    this.socket.on('reloadPage', () => {
      this.getPosts();
    });
  }
  getPosts() {
    this.postService.getPosts().subscribe(
      data => {
        this.streams = data.posts;
        this.topStreams = data.topPosts;
      },
      err => {
        if (err.error.token === null) {
          this.tokenService.deleteToken();
          setTimeout(() => {
            this.router.navigate(['']);
          }, 500);

        }
      }
    )
  }
  likePost(post) {
    this.postService.addLike(post).subscribe(
      data => {

        this.socket.emit('reload', {});
      },
      err => {
        console.log(err);
      }
    )
  }

  isUserInLikes(arr, username) {
    return _.some(arr, { username: username });
  }

  openCommentBox(post) {
    this.router.navigate(['tabs/post', post._id]);
  }
  timeAgo(time) {
    // moment.locale('ar-eg');
    return moment(time).fromNow();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: PostPage,
      cssClass: 'post-custom-class'
    });
    return await modal.present();
  }

  logout() {
    this.tokenService.deleteToken();
    setTimeout(() => {
      this.router.navigate(['']);
    }, 500);
  }

}
