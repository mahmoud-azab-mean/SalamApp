import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import * as io from 'socket.io-client';
import * as moment from 'moment'

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  loggedInUser: any;
  notifications = [];
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
        this.notifications = data.result.notifications.reverse();
      }
    )
  }

  markNotification(notification) {
    this.userService.markNotification(notification._id).subscribe(
      data => {
        this.socket.emit('reload', {});
      }
    )
  }

  markAllAsRead() {
    this.userService.markAllAsRead().subscribe(
      data => {
        this.socket.emit('reload', {});
      }
    )
  }

  deleteNotification(notification) {
    this.userService.markNotification(notification._id, true).subscribe(
      data => {
        this.socket.emit('reload', {});
      }
    )
  }

  timeAgo(time) {
    return moment(time).fromNow();
  }
}
