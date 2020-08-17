import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { SideComponent } from 'src/app/components/side/side.component';
import { PostComponent } from 'src/app/components/post/post.component';
import { PostsComponent } from 'src/app/components/posts/posts.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from 'src/app/services/token.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { TokenInterceptor } from 'src/app/services/token-interceptor';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { TopStreamsComponent } from '../components/top-streams/top-streams.component';
import { MessageService } from '../services/message.service';
import { NgxAutoScrollModule } from "ngx-auto-scroll";
import { EmojiPickerModule } from 'ng2-emoji-picker';
import { AlertifyService } from '../services/alertify.service';

@NgModule({
  declarations: [
    NavbarComponent,
    SideComponent,
    PostComponent,
    PostsComponent,
    TopStreamsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxPaginationModule,
    NgxAutoScrollModule,
    EmojiPickerModule.forRoot()
  ],
  exports: [
    NavbarComponent,
    SideComponent,
    PostComponent,
    PostsComponent,
    TopStreamsComponent,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxPaginationModule,
    NgxAutoScrollModule,
    EmojiPickerModule
  ],
  providers: [
    TokenService,
    PostService,
    UserService,
    MessageService,
    AlertifyService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
})
export class SharedModule { }
