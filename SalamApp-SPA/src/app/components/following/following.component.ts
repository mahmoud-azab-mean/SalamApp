import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  loggedInUser: any;
  userFollowing = [];
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


}
