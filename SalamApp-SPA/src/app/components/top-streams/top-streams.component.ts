import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {

  topPosts = [];
  socket: SocketIOClient.Socket;
  user: any;
  constructor(private postService: PostService, private tokenService: TokenService, private router: Router) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.getPosts();
    this.socket.on('reloadPage', () => {
      this.getPosts();
    })
  }
  getPosts() {
    this.postService.getPosts().subscribe(
      data => {
        this.topPosts = data.topPosts;
      },
      err => {
        if (err.error.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
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

  timeAgo(time) {
    // moment.locale('ar-eg');
    return moment(time).fromNow();
  }

  isUserInLikes(arr, username) {
    return _.some(arr, { username: username });
  }

  openCommentBox(post) {
    this.router.navigate(['post', post._id]);
  }

}
