import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { TokenService } from 'src/app/services/token.service';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit, OnChanges {
  @Input() user;
  userPosts = [];
  userData: any;
  currentUser: any;
  socket: SocketIOClient.Socket;

  constructor(private postService: PostService, private userService: UserService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnChanges() {
    if (this.user) {
      this.userPosts = this.user.posts.reverse();
      this.userData = this.user;
      this.tokenService.getPayload().then(
        user => {
          this.currentUser = user;
        }
      );
    }

  }

  ngOnInit() {
    if (this.user) {
      this.userPosts = this.user.posts.reverse();
    }
    this.socket.on('reloadPage', () => {
      this.getPosts();
    });
  }

  getPosts() {
    this.userService.getUser(this.userData._id).subscribe(
      data => {
        this.userData = data.result;
        this.userPosts = data.result.posts.reverse();
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

  isUserInLikes(arr, username): boolean {
    return _.some(arr, { username: username });
  }

  timeAgo(time) {
    return moment(time).fromNow();
  }

}
