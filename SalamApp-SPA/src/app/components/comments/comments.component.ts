import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  socket: any;
  navbarContent: any;
  commentForm: FormGroup;
  postId: any;
  post: any;
  comments = [];
  p: number = 1;
  constructor(private fb: FormBuilder, private postService: PostService, private route: ActivatedRoute) { this.socket = io('http://localhost:3000'); }

  ngOnInit() {
    this.navbarContent = document.querySelector('.nav-content');
    this.init();
    this.postId = this.route.snapshot.paramMap.get(('id'));
    this.getPost();
    this.socket.on('reloadPage', () => {
      this.getPost();
    })
  }
  ngAfterViewInit() {
    this.navbarContent.style.display = 'none';
  }
  init() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }
  addComment() {
    this.postService.addComment(this.postId, this.commentForm.value.comment).subscribe(
      data => {
        this.commentForm.reset();
        this.socket.emit('reload', {});
      },
      err => {
        console.log(err);
      }
    )
  }
  getPost() {
    this.postService.getPost(this.postId).subscribe(
      data => {
        console.log(data);
        this.post = data.post;
        this.comments = data.post.comments.reverse();
      },
      err => {
        console.log(err);
      }
    )
  }
  timeAgo(time) {
    // moment.locale('ar-eg');
    return moment(time).fromNow();
  }
}
