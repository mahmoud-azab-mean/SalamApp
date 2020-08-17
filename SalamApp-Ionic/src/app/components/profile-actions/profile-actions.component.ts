import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import * as _ from 'lodash';
import * as io from 'socket.io-client';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-profile-actions',
  templateUrl: './profile-actions.component.html',
  styleUrls: ['./profile-actions.component.scss'],
})
export class ProfileActionsComponent implements OnInit {
  user: any;
  loggedInUser: any;
  socket: SocketIOClient.Socket;
  isFollowing: boolean;
  constructor(private tokenService: TokenService, private userService: UserService, private popoverController: PopoverController, private navParams: NavParams) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.navParams.get('user');
    this.tokenService.getPayload().then(user => {
      this.loggedInUser = user;
      this.getUser();
      this.socket.on('reloadPage', () => {
        this.getUser();
      })
    });
  }

  getUser() {
    const result = _.find(this.user.followers, ['follower._id', this.loggedInUser._id]);
    if (result) {
      this.isFollowing = true;
    } else {
      this.isFollowing = false;
    }
  }

  follow() {
    this.userService.followUser(this.user._id).subscribe(
      data => {
        this.socket.emit('reload', {});
        this.dismiss();
      }
    )
  }

  unFollow() {
    this.userService.unFollowUser(this.user._id).subscribe(
      data => {
        this.socket.emit('reload', {});
        this.dismiss();
      }
    )
  }

  async dismiss() {
    await this.popoverController.dismiss();
  }


}
