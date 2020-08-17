import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthtabsGuard } from './guards/authtabs.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: './components/auth-tabs/auth.module#AuthModule',
    canActivate: [AuthtabsGuard]
  },
  {
    path: 'streams',
    loadChildren: './components/streams/streams.module#StreamsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'post/:id',
    loadChildren: './components/comments/comments.module#CommentsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'people',
    loadChildren: './components/people/people.module#PeopleModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'people/following',
    loadChildren: './components/following/following.module#FollowingModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'people/followers',
    loadChildren: './components/followers/followers.module#FollowersModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren: './components/notifications/notifications.module#NotificationsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'chat/:id',
    loadChildren: './components/chat/chat.module#ChatModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'photos/:id',
    loadChildren: './components/photos/photos.module#PhotosModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/:id',
    loadChildren: './components/view-profile/view-profile.module#ViewProfileModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'account/password',
    loadChildren: './components/change-password/change-password.module#ChangePasswordModule',
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'streams'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
