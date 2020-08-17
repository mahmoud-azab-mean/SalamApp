import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {
  loggedInUser: any;
  userFollowing = [];
  userFollowers = [];
  socket: any;
  constructor(private userService: UserService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getUser();
    this.socket.on('reloadPage', () => {
      this.getUser();
    })
  }

  getUser() {
    this.userService.getUser(this.loggedInUser._id).subscribe(
      data => {
        this.userFollowing = data.result.following;
        this.userFollowers = data.result.followers;
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
      return true
    } else return false;
  }
}
