import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.page.html',
  styleUrls: ['./chat-list.page.scss'],
})
export class ChatListPage implements OnInit {
  customStyle: string = environment.scrollbarStyle;
  currentUser: any;
  chatList = [];
  constructor(private userService: UserService, private tokenService: TokenService) { }

  ngOnInit() {
    this.tokenService.getPayload().then(
      user => {
        this.currentUser = user;
        this.getUser(user._id);
      }
    )
  }

  getUser(id) {
    this.userService.getUser(id).subscribe(
      data => {
        this.chatList = data.result.chatList;
      }
    )
  }

  calendarDate(date) {
    return moment(date).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: '[Last week]',
      sameElse: 'DD/MM/YYYY'
    });
  }

  countUnreadMessages(messages, id) {
    let total = 0;
    _.forEach(messages, msg => {
      if (msg.isRead === false && msg.receiverId !== id) {
        total++;
      }
    });
    return total;
  }
}
