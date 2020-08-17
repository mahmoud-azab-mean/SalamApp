import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit, OnChanges {
  @Input() user: any;
  photos = [];
  constructor() { }
  ngOnChanges() {
    this.photos = this.user.photos;
  }
  ngOnInit() { }

}
