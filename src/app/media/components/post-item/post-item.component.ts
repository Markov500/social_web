import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {
  @Input() post!: Post;
  @Output() postCommented = new EventEmitter<{ comment: string, postId: number }>()
  ngOnInit(): void {

  }

  onNewComment(comment: string) {
    this.postCommented.emit({ comment, postId: this.post.id })
  }

}
