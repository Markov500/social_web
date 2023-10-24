import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './components/comments/comments.component'
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { shortPipe } from './pipes/short.pipe';



@NgModule({
  declarations: [
    CommentsComponent,
    shortPipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommentsComponent,
    MaterialModule,
    ReactiveFormsModule,
    shortPipe,
  ]
})
export class SharedModule { }
