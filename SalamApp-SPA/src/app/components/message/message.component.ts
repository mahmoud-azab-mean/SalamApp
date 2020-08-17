import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from 'src/app/services/message.service';
import { CaretEvent, EmojiEvent } from 'ng2-emoji-picker';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import * as _ from 'lodash';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() users;
  socket: SocketIOClient.Socket;
  typing = false;
  typingmessage;
  receiverId: string;
  senderData: any;
  receiverData: any;
  message: any;
  messages = [];
  isOnline: boolean;
  public eventMock;
  public eventPosMock;
  public direction = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : (Math.random() > 0.5 ? 'right' : 'left');
  public toggled = false;
  public content = ' ';
  private _lastCaretEvent: CaretEvent;
  constructor(private userService: UserService, private messageService: MessageService, private tokenService: TokenService, private route: ActivatedRoute) {
    this.socket = io('http://localhost:3000');
  }
  ngOnChanges(changes: SimpleChanges) {
    if (!_.isEmpty(changes.users.currentValue)) {
      const result = _.indexOf(changes.users.currentValue, this.receiverId);
      if (result > -1) {
        this.isOnline = true;
      } else {
        this.isOnline = false;
      }
    }
  }
  ngOnInit() {
    this.senderData = this.tokenService.getPayload();
    this.route.params.subscribe(params => {
      this.receiverId = params.id;
      this.getReceiverData(this.receiverId);
    });
    this.socket.on('reloadPage', () => {
      this.getReceiverData(this.receiverId);
    });
    this.socket.on('is-typing', data => {
      if (data.sender === this.receiverId) {
        this.typing = true;
      }
    });
    this.socket.on('has-stopped-typing', data => {
      if (data.sender === this.receiverId) {
        this.typing = false;
      }
    });

  }

  ngAfterViewInit() {
    const params = {
      sender: this.senderData._id,
      receiver: this.receiverId
    }
    this.socket.emit('join-chat', params);
  }
  getReceiverData(id) {
    this.userService.getUser(id).subscribe(data => {
      this.receiverData = data.result;
      this.getMessages(this.senderData._id, this.receiverData._id);
    })
  }

  sendMessage() {
    this.messageService.sendMessage(this.senderData._id, this.receiverData._id, this.receiverData.username, this.message).subscribe(data => {
      this.socket.emit('reload', {});
      this.message = '';
    });
  }

  getMessages(senderId, receiverId) {
    this.messageService.getAllMessages(senderId, receiverId).subscribe(
      data => {
        this.messages = data.message.messages;
      }
    );
  }
  isTyping() {
    this.socket.emit('start-typing', {
      sender: this.senderData._id,
      receiver: this.receiverId
    });
    if (this.typingmessage) {
      clearTimeout(this.typingmessage);
    }
    this.typingmessage = setTimeout(() => {
      this.socket.emit('stop-typing', {
        sender: this.senderData._id,
        receiver: this.receiverId
      });
    }, 1000);

  }
  timeAgo(time) {
    // moment.locale('ar-eg');
    return moment(time).fromNow();
  }

  handleSelection(event: EmojiEvent) {
    this.content =
      this.content.slice(0, this._lastCaretEvent.caretOffset) +
      event.char +
      this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);
    if (this.message) {
      this.message += this.content;
    } else {
      this.message = this.content;
    }
    this.toggled = !this.toggled;
    this.content = '';
  }

  handleCurrentCaret(event: CaretEvent) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${
      event.textContent
      } }`;
  }

  Toggled() {
    this.toggled = !this.toggled;
  }
}
