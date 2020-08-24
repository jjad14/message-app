import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    isLoading = false;

    totalPosts = 0;
    postsPerPage = 5;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];

    userIsAuthenticated = false;
    userId: string;
    userData: {username: string, email: string};

    private postsSubscription: Subscription;
    private authStatusSub: Subscription;

    constructor(public postsService: PostsService, private authService: AuthService) {}

    ngOnInit() {
        this.isLoading = true;

        // get all posts
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        // get user id
        this.userId = this.authService.getUserId();
        this.postsSubscription = this.postsService
            .getPostUpdate()
            .subscribe((postData: {posts: Post[], postCount: number}) => {
                    this.isLoading = false;
                    this.totalPosts = postData.postCount;
                    this.posts = postData.posts;
            });

        // check if user is authenticated - only auth users can edit/delete their posts
        this.userIsAuthenticated = this.authService.getIsAuth();

        this.authStatusSub = this.authService
            .getAuthStatus()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId();
            });
    }

    // pagination
    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }

    // delete post - must be a users own post and authenticated
    onDelete(postId: string) {
        this.isLoading = true;

        this.postsService.deletePost(postId);
        this.postsService.getPosts(this.postsPerPage, this.currentPage);

        // this.postsService.deletePost(postId).subscribe(() => {
        //     this.postsService.getPosts(this.postsPerPage, this.currentPage);
        // }, () => {
        //     this.isLoading = false;
        // });
    }

    ngOnDestroy() {
        this.postsSubscription.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
}


