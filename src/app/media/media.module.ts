import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaRoutingModule } from './media-routing.module';
import { PostService } from './services/post.service';
import { PostItemComponent } from './components/post-item/post-item.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostResolver } from './resolvers/post.resolver';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PostItemComponent,
    PostListComponent,
  ],
  imports: [
    CommonModule,
    MediaRoutingModule,
    SharedModule
  ],
  providers: [
    PostService,
    PostResolver,
  ]
})
export class MediaModule { }
