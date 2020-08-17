import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  navbarContent: any;
  onlineUsers = [];
  constructor() { }

  ngOnInit() {
    this.navbarContent = document.querySelector('.nav-content');
  }
  ngAfterViewInit() {
    this.navbarContent.style.display = 'none';
  }

  online(event) {
    this.onlineUsers = event;
  }

}
