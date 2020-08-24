import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts/posts.service';
import { Post } from '../posts/post.model';
import { AuthService } from '../auth/auth.service';
import { PageEvent } from '@angular/material';
import { ThreadService } from './thread.service';

@Component({
    templateUrl: './thread.component.html',
    styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit, OnDestroy {
    isLoading = false;

    post: Post;

    imagePreview: string;
    title = '';
    content = '';

    totalComments = 0;
    commentsPerPage = 5;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];

    userIsAuthenticated = false;
    userId: string;
    private userName: string;

    // gave me an error if i set it to type Comment[]
    comments: any[] = [];

    private postId: string;
    private authStatusSub: Subscription;
    private commentsSubscription: Subscription;
    private postsSubscription: Subscription;

    constructor(private threadService: ThreadService,
                private postsService: PostsService,
                private route: ActivatedRoute,
                private authService: AuthService) { }

    ngOnInit() {
        this.isLoading = true;

        // get user data
        this.userId = this.authService.getUserId();
        this.userName = this.authService.getUserName();

        // get a single Post by the id param
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.postId = paramMap.get('postId');
                this.isLoading = true;

                this.postsSubscription = this.postsService.getPost(this.postId)
                .subscribe(postData => {
                    this.isLoading = false;
                    this.post = {
                                id: postData._id,
                                title: postData.title,
                                content: postData.content,
                                imagePath: postData.imagePath,
                                creator: postData.creator
                    };
                    this.title = this.post.title;
                    this.content = this.post.content;
                    this.imagePreview = this.post.imagePath;
                });

             }
        });

        // Get Comments of a Post
        this.threadService.getComments(this.postId, this.commentsPerPage, this.currentPage);

        // Get comments subscription
        this.commentsSubscription = this.threadService
            .getCommentUpdate()
            .subscribe((commentData: {comments: Comment[], commentCount: number}) => {
                    this.isLoading = false;
                    this.totalComments = commentData.commentCount;
                    this.comments = commentData.comments;
            });

        // check if user is authenticated - only auth users can comment
        this.userIsAuthenticated = this.authService.getIsAuth();

        this.authStatusSub = this.authService
            .getAuthStatus()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId();
                this.userName = this.authService.getUserName();
            });

    }

    // pagination
    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.commentsPerPage = pageData.pageSize;
        this.threadService.getComments(this.postId, this.commentsPerPage, this.currentPage);
    }

    // submit comment
    onComment(form: NgForm, event: Event) {
        if (form.invalid) {
            return;
        }
        this.threadService.addComment(this.postId, this.userName, form.value.comment);
        this.threadService.getComments(this.postId, this.commentsPerPage, this.currentPage);

        form.resetForm();
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
        this.commentsSubscription.unsubscribe();
        this.postsSubscription.unsubscribe();
    }


}
