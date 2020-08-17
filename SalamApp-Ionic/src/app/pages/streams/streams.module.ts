import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StreamsPageRoutingModule } from './streams-routing.module';

import { StreamsPage } from './streams.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StreamsPageRoutingModule,
    SharedModule
  ],
  declarations: [StreamsPage]
})
export class StreamsPageModule { }
