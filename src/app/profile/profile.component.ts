import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Post } from '../posts/post.model';
import { PostsService } from '../posts/posts.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { mimeType } from '../shared/mime-type.validator';


@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
    posts: Post[] = [];

    isLoading = false;

    totalPosts = 0;
    postsPerPage = 1;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];

    userId: string;
    userData: User;

    userIsAuthenticated = false;

    form: FormGroup;
    imagePreview: string;

    private postsSubscription: Subscription;
    private authStatusSubscription: Subscription;
    private userDataSubscription: Subscription;

    constructor(public postsService: PostsService, private authService: AuthService) {}

    ngOnInit() {
        this.isLoading = true;

        // form definition
        this.form = new FormGroup({
            username: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(4), Validators.maxLength(30)]
            }),
            email: new FormControl(null, {
                validators: [Validators.required, Validators.email],
            }),
            firstName: new FormControl(null, {
                validators: [Validators.required, Validators.maxLength(50)]
            }),
            lastName: new FormControl(null, {
                validators: [Validators.required, Validators.maxLength(50)],
            }),
            gender: new FormControl(null, {
                validators: [Validators.required],
            })
        });

        // get user id
        this.userId = this.authService.getUserId();
        // get all posts by userid
        this.postsService.getPostsById(this.userId, this.postsPerPage, this.currentPage);

        // get a single user
        this. userDataSubscription = this.authService.getUser(this.userId)
            .subscribe(user => {
                this.isLoading = false;
                this.userData = {
                    id: this.userId,
                    username: user.userData.username,
                    email: user.userData.email,
                    firstName: user.userData.firstName,
                    lastName: user.userData.lastName,
                    gender: user.userData.gender
                };

                this.form.setValue({
                    username: this.userData.username,
                    email: this.userData.email,
                    firstName: this.userData.firstName,
                    lastName: this.userData.lastName,
                    gender: this.userData.gender
                });

            });

        this.postsSubscription = this.postsService
            .getPostUpdate()
            .subscribe((postData: {posts: Post[], postCount: number}) => {
                    this.isLoading = false;
                    this.totalPosts = postData.postCount;
                    this.posts = postData.posts;
            });

        this.userIsAuthenticated = this.authService.getIsAuth();

        this.authStatusSubscription = this.authService
            .getAuthStatus()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId();
            }
        );

    }

    // edit user
    onEdit() {
        if (this.form.invalid) {
            return;
        }
        // this.isLoading = true;

        this.userData = {
            id: this.userId,
            username: this.form.value.username,
            email: this.form.value.email,
            firstName: this.form.value.firstName,
            lastName: this.form.value.lastName,
            gender: this.form.value.gender
        };

        this.authService.updateUser(
            this.userId,
            this.userData
        );

        // get User again?
    }

    // pagination
    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPostsById(this.userId, this.postsPerPage, this.currentPage);
    }

    // delete a single post
    onDeletePost(postId: string) {
        this.isLoading = true;
        this.postsService.deletePost(postId);
        this.postsService.getPostsById(this.userId, this.postsPerPage, this.currentPage);
    }

    // delete profile
    onDeleteProfile() {
        this.isLoading = true;
        this.authService.deleteProfile(this.userId);
    }

    ngOnDestroy() {
        this.postsSubscription.unsubscribe();
        this.authStatusSubscription.unsubscribe();
        this. userDataSubscription.unsubscribe();
    }
}

