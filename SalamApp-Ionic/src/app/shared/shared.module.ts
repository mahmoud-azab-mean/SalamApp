import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { TokenService } from '../services/token.service';
import { TokenInterceptor } from '../services/token-interceptor';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { MessageService } from '../services/message.service';
import { IonCustomScrollbarModule } from 'ion-custom-scrollbar'
import { RouterModule } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    IonCustomScrollbarModule,
    IonicStorageModule.forRoot()
  ],
  exports: [
    HttpClientModule,
    RouterModule,
    IonCustomScrollbarModule,
    IonicStorageModule
  ],
  providers: [
    TokenService,
    UserService,
    PostService,
    MessageService,
    Camera,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
})
export class SharedModule { }
