import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import * as _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit {
  loggedInUser: any;
  userData: any;
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
        this.userData = data.result;
      }
    )
  }


}
