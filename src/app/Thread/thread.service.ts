import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { ThreadSocketService } from './thread-socket.service';

const BACKEND_URL = environment.apiUrl + '/thread';

@Injectable({
    providedIn: 'root'
})
export class ThreadService {

    private comments: Comment[];
    private commentsUpdated = new Subject<{comments: Comment[], commentCount: number}>();

    constructor(
        private http: HttpClient,
        private router: Router,
        private authService: AuthService,
        private threadSocketService: ThreadSocketService) {
            this.observePostSocket();
        }

    addComment(id: string, username: string, content: string) {
        const commentData = {
            username,
            content
        };

        this.http
        .post<{message: string, comment: Comment }>(
            BACKEND_URL + '/' + id,
            commentData
        )
        .subscribe((resData) => {
            // this.router.navigate(['/thread', id]);
            this.threadSocketService.emitCreateCommentSocket(resData.comment);
        });
    }

    getComments(id: string, commentPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${commentPerPage}&page=${currentPage}`;
        this.http
            .get<{message: string, comments: any, maxComments: number}>(
                BACKEND_URL + '/' + id + queryParams)
            .pipe(
                map(commentData => {
                    return {
                        comments: commentData.comments.map(comment => {
                        // const date = new Date(comment.createdAt);
                        // date.toDateString();
                        return {
                            content: comment.content,
                            createdBy: comment.createdBy,
                            createdId: comment.createdId,
                            createdAt: comment.createdAt
                        };
                    }),
                    maxComments: commentData.maxComments
                };
            }))
            .subscribe((transformedCommentData) => {
                this.comments = transformedCommentData.comments;
                this.commentsUpdated.next({
                    comments: [...this.comments],
                    commentCount: transformedCommentData.maxComments
                });
            });
    }

    // return updatedComments as an observable to be subscirbed
    getCommentUpdate() {
        return this.commentsUpdated.asObservable();
    }

    private observePostSocket() {
        this.threadSocketService.receiveCreateCommentSocket()
        .subscribe((comment: any) => {
          console.log(`Create ${comment.id} Post socket received`);
          this.refreshComments(comment);
        });


    }

    // refresh posts
    private refreshComments(comment: any) {
    if (comment.createdId !== this.authService.getUserId()) {
        // this.getPosts();
    }
    }

}


