import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../../core/models/comment.model'
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { animate, animateChild, group, query, sequence, stagger, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { flashAnimation } from '../../animations/flash.animation';
import { appearingAnimation } from '../../animations/appearing.animation';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  animations: [
    trigger('list', [
      transition(':enter', [
        query('@listeItem', [
          stagger(100, [
            animateChild()
          ])
        ], { optional: true })
      ])
    ]),
    trigger(
      'listeItem',
      [
        //Etat par défaut
        state("default", style(
          {
            transform: 'scale(1)',
          }
        )),

        //Etat par actif
        state("active", style({
          backgroundColor: 'rgb(80, 151, 251)',
          transform: 'scale(1.02)',
        })),

        //Transition d'apparition
        transition(':enter', [
          query('.text, .date', [
            style({
              opacity: 0
            })
          ]),
          useAnimation(appearingAnimation, {
            params: {
              color: 'rgb(80, 151, 251)'
            }
          }),
          group([
            useAnimation(flashAnimation),
            query('.text', [
              animate('250ms', style({
                opacity: 1
              }))
            ]),
            query('.date', [
              animate('500ms', style({
                opacity: 1
              }))
            ]),
          ]),
        ]),

        //Transition defaut vers actif
        transition('default => active', [
          animate('100ms ease-in-out')
        ]),

        //Transition actif  vers defaut
        transition('active => default', [
          animate('300ms ease-in-out')
        ]),

      ]
    )
  ]
})
export class CommentsComponent implements OnInit {
  @Input() comments!: Comment[];
  @Output() newComment = new EventEmitter<string>;
  commentCtrl!: FormControl;
  listItemState: { [key: number]: 'default' | 'active' } = {};
  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    this.commentCtrl = this.formBuilder.control("", [Validators.required]);
    for (let id in this.comments) {
      this.listItemState[id] = 'default';
    }
  }
  onLeaveComment() {
    if (this.commentCtrl.invalid) {
      return;
    }
    const maxId = Math.max(...this.comments.map(comment => comment.id));
    this.comments.unshift({
      id: maxId + 1,
      comment: this.commentCtrl.value,
      createdDate: new Date().toISOString(),
      userId: 1
    });
    this.newComment.emit(this.commentCtrl.value);
    this.commentCtrl.reset();
  }

  mouseEnter(i: number) {
    this.listItemState[i] = 'active'
  }
  mouseLeave(i: number) {
    this.listItemState[i] = 'default'
  }
}
