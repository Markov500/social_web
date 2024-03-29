import { Injectable } from "@angular/core";
import { PostService } from "../services/post.service";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Post } from "../models/post.model";

@Injectable()
export class PostResolver implements Resolve<Post[]>{
    constructor(private postService: PostService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post[]> {
        return this.postService.getPosts();
    }


}