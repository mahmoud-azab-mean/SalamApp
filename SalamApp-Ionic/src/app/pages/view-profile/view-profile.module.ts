import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewProfilePageRoutingModule } from './view-profile-routing.module';

import { ViewProfilePage } from './view-profile.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostsComponent } from 'src/app/components/posts/posts.component';
import { UserFriendsComponent } from 'src/app/components/user-friends/user-friends.component';
import { PhotosComponent } from 'src/app/components/photos/photos.component';
import { ProfileActionsComponent } from 'src/app/components/profile-actions/profile-actions.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewProfilePageRoutingModule,
    SharedModule
  ],
  declarations: [ViewProfilePage, PostsComponent, UserFriendsComponent, PhotosComponent, ProfileActionsComponent]
})
export class ViewProfilePageModule { }
