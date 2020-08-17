import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import * as io from 'socket.io-client';
import { UserService } from 'src/app/services/user.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrls: ['./user-friends.component.scss'],
})
export class UserFriendsComponent implements OnInit, OnChanges {
  @Input() friends: any;
  followings = [];
  followers = [];
  isFollowing: boolean;
  isFollower: boolean;
  socket: SocketIOClient.Socket;
  loggedInUser: any;
  userFollowing = [];
  onlineUsers = [];
  constructor(private userService: UserService, private tokenService: TokenService, private router: Router) { this.socket = io('http://localhost:3000'); }
  ngOnChanges() {
    if (this.friends && this.friends.isFollowing) {
      this.isFollowing = true;
      this.isFollower = false;
      this.followings = this.friends.user.following;

    }
    if (this.friends && !this.friends.isFollowing) {
      this.isFollowing = false;
      this.isFollower = true;
      this.followers = this.friends.user.followers;

    }
  }

  ngOnInit() {
    this.tokenService.getPayload().then(user => {
      this.loggedInUser = user;
      this.getUser();
      this.socket.on('reloadPage', () => {
        this.getUser();
      })
    });
  }

  getUser() {
    this.userService.getUser(this.loggedInUser._id).subscribe(
      data => {
        this.userFollowing = data.result.following;
      }
    )
  }

  followUser(user) {
    this.userService.followUser(user._id).subscribe(
      data => {
        this.socket.emit('reload', {});
      }
    )
  }

  unFollowUser(user) {
    this.userService.unFollowUser(user._id).subscribe(
      data => {
        this.socket.emit('reload', {});
      }
    )
  }

  isFollowed(arr, id) {
    const result = _.find(arr, ['userFollowed._id', id]);
    if (result) {
      return true;
    } else return false;
  }
  online(event) {
    this.onlineUsers = event;
  }
  checkIfOnline(id) {
    const result = _.indexOf(this.onlineUsers, id);
    if (result > -1) {
      return true;
    } else {
      return false;
    }
  }

  viewProfile(user) {
    this.router.navigate(['tabs/view-profile', user._id]);
  }

}
