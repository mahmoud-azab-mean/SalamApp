import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import { Location } from '@angular/common';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
  socket: SocketIOClient.Socket;
  postId: string;
  post: any;
  comment: string;
  comments = [];
  customStyle: string = environment.scrollbarStyle;
  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router, private location: Location) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.getPost();
    this.socket.on('reloadPage', () => {
      this.getPost();
    });
  }

  goBack() {
    this.location.back();
  }

  addComment() {
    if (this.comment) {
      this.postService.addComment(this.postId, this.comment).subscribe(
        data => {
          this.comment = '';
          this.socket.emit('reload', {});
        },
        err => { console.log(err) }
      )
    }
  }

  getPost() {
    this.postService.getPost(this.postId).subscribe(
      data => {
        this.post = data.post;
        this.comments = data.post.comments.reverse();
      },
      err => {
        console.log(err);
      }
    )
  }

  timeAgo(time) {
    return moment(time).fromNow();
  }

}
