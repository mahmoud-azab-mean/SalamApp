import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import * as M from 'materialize-css';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit, AfterViewInit {
  navbarContent: any;
  socket: SocketIOClient.Socket;
  userData: any;
  posts = [];
  currentUser: any;
  userId: any;
  modalElement: any;
  post: any;
  userFollowing = [];
  userFollowers = [];
  constructor(private userService: UserService, private postService: PostService, private tokenService: TokenService, private alertifyService: AlertifyService, private route: ActivatedRoute, private router: Router) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.currentUser = this.tokenService.getPayload();
    this.navbarContent = document.querySelector('.nav-content');
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});
    this.modalElement = document.querySelector('.modal');
    M.Modal.init(this.modalElement, {});
    this.route.params.subscribe(
      params => {
        const userId = params.id;
        this.userId = params.id;
        this.getUserData(userId);
        this.socket.on('reloadPage', () => {
          this.getUserData(userId);
        });
      }
    )
  }
  ngAfterViewInit() {
    this.navbarContent.style.display = 'none';
  }

  getUserData(id) {
    this.userService.getUser(id).subscribe(
      data => {
        this.userData = data.result;
        this.posts = data.result.posts.reverse();
        this.userFollowing = data.result.following;
        this.userFollowers = data.result.followers;
      },
      err => {
        console.error(err);
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
    this.router.navigate(['post', post._id]);
  }

  timeAgo(time) {
    return moment(time).fromNow();
  }

  openModal(post) {
    this.post = post;
  }

  closeModal() {
    this.socket.emit('reload', {});
    M.Modal.getInstance(this.modalElement).close();
  }

  editPost() {
    if (this.post) {
      const body = {
        id: this.post._id,
        post: this.post.post
      };
      this.postService.editPost(body).subscribe(
        data => {
          this.socket.emit('reload', {});
          this.alertifyService.success('post edited successfully');
          M.Modal.getInstance(this.modalElement).close();
        },
        err => this.alertifyService.error('error occured')
      );

    } else {
      this.alertifyService.error('enter post text');
      document.getElementsByName('post')[0].focus()
    }

  }

  deletePost(id) {
    this.alertifyService.confirm('do u like to delete this post?', () => {
      this.postService.deletePost(id).subscribe(
        data => {
          this.socket.emit('reload', {});
          this.alertifyService.success('post deleted successfully');
        },
        err => this.alertifyService.error('error occured')
      );
    })
  }

}
