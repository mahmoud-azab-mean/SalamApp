import { Component, OnInit, Renderer2, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import * as io from 'socket.io-client';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MessageService } from 'src/app/services/message.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() onlineUsers = new EventEmitter();
  user: any;
  notifications = [];
  unreadNotifications = [];
  socket: SocketIOClient.Socket;
  chatList = [];
  messages = [];
  count: any;
  photoVersion: any;
  photoId: any;
  photoUrl: any;
  constructor(private tokenService: TokenService, private userService: UserService, private messageService: MessageService, private router: Router, private renderer: Renderer2) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    const nav = document.querySelector('.sidenav');
    const dropDownElement = document.querySelector('.dt1');
    const dropDownElement2 = document.querySelector('.dt2');
    M.Sidenav.init(nav, {});
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      coverTrigger: false,
      inDuration: 400,
      outDuration: 400
    });
    M.Dropdown.init(dropDownElement2, {
      alignment: 'right',
      coverTrigger: false,
      inDuration: 400,
      outDuration: 400
    });
    this.user = this.tokenService.getPayload();
    this.socket.emit('online', { room: 'global', userId: this.user._id });
    this.getUser();
    this.socket.on('reloadPage', () => {
      this.getUser();
    })
  }
  ngAfterViewInit() {
    this.socket.on('usersOnline', data => {
      this.onlineUsers.emit(data);
    })
  }
  ngOnDestroy() {
    let overlay = document.getElementsByClassName('sidenav-overlay');
    this.renderer.removeClass(overlay[0], 'sidenav-overlay');
  }

  getUser() {
    if (this.router.url.includes('/chat')) {
      setTimeout(() => {
        this.getUser();
      }, 2000);
    }
    this.userService.getUser(this.user._id).subscribe(
      data => {
        this.photoVersion = data.result.photoVersion;
        this.photoId = data.result.photoId;
        this.photoUrl = `https://res.cloudinary.com/dxpxowuoc/image/upload/v${this.photoVersion}/${this.photoId}`;
        this.notifications = data.result.notifications.reverse();
        this.unreadNotifications = _.filter(this.notifications, ['read', false]);
        this.chatList = data.result.chatList;
        this.messages = [];
        this.chatList.forEach(element => {
          if (this.router.url === `/chat/${element.receiverId._id}`) {
            this.messageService.markMessages(element.receiverId._id, this.user._id).subscribe(
              data => {
              }
            );
          }
          this.messages.push(
            _.filter(element.messageId.messages,
              { 'isRead': false, 'receiverId': this.user._id })
          );
        });
        this.count = this.messages.length;
        _.forEach(this.messages, (message) => {
          if (_.isEmpty(message)) {
            this.count--
          }
        });


      }
    );

  }
  markMessages(senderId) {
    this.router.navigate(['chat', senderId]);
    this.messageService.markMessages(senderId, this.user._id).subscribe(
      data => {
        console.log(data);
        this.socket.emit('reload', {});
      }
    )
  }

  markAllMessages() {
    this.messageService.markAllMessages().subscribe(
      data => {
        this.socket.emit('reload', {});
        this.count = 0;
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
  timeAgo(time) {
    return moment(time).fromNow();
  }
  calendarDate(date) {
    return moment(date).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: '[Last week]',
      sameElse: 'DD/MM/YYYY'
    });
  }
  logOut() {
    if (this.tokenService.getToken()) {
      this.socket.disconnect();
      this.tokenService.deleteToken();
      this.router.navigate(['']);
    }
  }
}
