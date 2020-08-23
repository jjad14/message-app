import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Post } from './post.model';
import { environment } from '../../environments/environment';
import { PostSocketService } from './post-socket.service';
import { AuthService } from '../auth/auth.service';

const BACKEND_URL = environment.apiUrl + '/posts';

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
    private profilePostsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(
        private http: HttpClient,
        private router: Router,
        private authService: AuthService,
        private postSocketService: PostSocketService) {
            this.observePostSocket();
        }

    // add post
    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);

        this.http
            .post<{message: string, post: Post}>(
                BACKEND_URL,
                postData
            )
            .subscribe((resData) => {
                this.router.navigate(['/']);
                // emit socket with the post id
                this.postSocketService.emitCreatePostSocket(resData.post);
            });
    }

    // get posts
    getPosts(postPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
        this.http
            .get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
            .pipe(
                map(postData => {
                    return {
                        posts: postData.posts.map(post => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath,
                            creator: post.creator
                            // , comments: post.comments
                        };
                    }),
                    maxPosts: postData.maxPosts
                };
            }))
            .subscribe((transformedPostData) => {
                this.posts = transformedPostData.posts;
                this.postsUpdated.next({
                    posts: [...this.posts],
                    postCount: transformedPostData.maxPosts
                });
            });
    }

    // get posts by user id
    getPostsById(userId: string, postPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;

        this.http
            .get<{message: string, posts: any, maxPosts: number}>(
                BACKEND_URL + '/profile/' + userId + queryParams)
            .pipe(
                map(postData => {
                    return {
                        posts: postData.posts.map(post => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id,
                            imagePath: post.imagePath,
                            creator: post.creator
                            // , comments: post.comments
                        };
                    }),
                    maxPosts: postData.maxPosts
                };
            }))
            .subscribe((transformedPostData) => {
                this.posts = transformedPostData.posts;
                this.postsUpdated.next({
                    posts: [...this.posts],
                    postCount: transformedPostData.maxPosts
                });
            });
    }

    // get post by id (post id)
    getPost(id: string) {
        return this.http.get<{
            _id: string,
            title: string,
            content: string,
            imagePath: string,
            creator: string
            // ,comments: Comment[]
        }>(BACKEND_URL + '/' + id);
    }

    // return updatedPosts as an observable to be subscirbed
    getPostUpdate() {
        return this.postsUpdated.asObservable();
    }

    // update post by id
    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {
                id,
                title,
                content,
                imagePath: image,
                creator: null,
                comments: null
            };
        }

        this.http
            .put(BACKEND_URL + '/' + id, postData)
            .subscribe(response => {
                this.router.navigate(['/']);
                // emit socket with the newly updated post data
                this.postSocketService.emitUpdatePostSocket(postData);
            }
        );
    }

    // delete post by id
    deletePost(postId: string) {
        const postData: Post = this.posts.find(post => post.id === postId);

        this.http.delete
        (BACKEND_URL + '/' + postId)
        .subscribe((response) => {
          // emit socket with the post data
          this.postSocketService.emitDeletePostSocket(postData);
        });
    }

    commentOnPost(postId: string, userId: string, content: string) {
        const commentData = {
            user: userId,
            content
        };

        // this.http
        // .post<{ message: string }>(BACKEND_URL + '/comment/' + postId, commentData)
        // .subscribe(response => {
        //     console.log(response);
        // });
    }

    //  Observe Post Socket function
    private observePostSocket() {
        // create post sockets
        this.postSocketService.receiveCreatePostSocket()
        .subscribe((post: any) => {
          console.log(`Create ${post.id} Post socket received`);
          this.refreshPosts(post);
        });
        // update post sockets
        this.postSocketService.receiveUpdatePostSocket()
        .subscribe((post: any) => {
          console.log(`Update ${post.id} Post socket received`);
          this.refreshPosts(post);
        });
        // delete post sockets
        this.postSocketService.receiveDeletePostSocket()
        .subscribe((post: any) => {
          console.log(`Delete ${post.id} Post socket received`);
          this.refreshPosts(post);
        });
      }

      // refresh posts
      private refreshPosts(post: any) {
        if (post.creator !== this.authService.getUserId()) {
          // this.getPosts();
        }
      }

}
