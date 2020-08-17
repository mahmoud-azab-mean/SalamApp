import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { PopoverController } from '@ionic/angular';
import { ProfileActionsComponent } from 'src/app/components/profile-actions/profile-actions.component';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.page.html',
  styleUrls: ['./view-profile.page.scss'],
})
export class ViewProfilePage implements OnInit {
  customStyle: string = environment.scrollbarStyle;
  segment: string;
  userData: any;
  userId: string;
  photoUrl: string;
  headerImage: any;
  userFriends: any;
  socket: SocketIOClient.Socket;
  constructor(private userService: UserService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private location: Location, private popoverController: PopoverController) {
    this.segment = 'posts';
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.userId = params.id;
        this.getUserData(params.id);
        this.socket.on('reloadPage', () => {
          this.getUserData(params.id);
        })
      }
    )
  }

  getUserData(id) {
    this.userService.getUser(id).subscribe(
      data => {
        this.userData = data.result;
        this.photoUrl = `https://res.cloudinary.com/dxpxowuoc/image/upload/v${this.userData.photoVersion}/${this.userData.photoId}`
        this.headerImage =
          this.sanitizer.bypassSecurityTrustStyle(`url(${this.photoUrl})`)
      }
    )
  }

  segmentChanged(event) {
    if (event.detail.value === 'followings') {
      this.userFriends = {
        isFollowing: true,
        user: this.userData
      }
    }
    if (event.detail.value === 'followers') {
      this.userFriends = {
        isFollowing: false,
        user: this.userData
      }
    }
  }
  goBack() {
    this.location.back();
  }

  async presentPopover(ev, userData) {
    this.socket.emit('reload', {});
    const popover = await this.popoverController.create(
      {
        component: ProfileActionsComponent,
        event: ev,
        componentProps: { user: userData },
        cssClass: 'popover'
      }
    );
    return await popover.present();
  }
}
