import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
})
export class PostSocketService {

    // service that emits sockets
    constructor(private socket: Socket) { }

    // emits a createPost socket with post data (the id)
    emitCreatePostSocket(post: any) {
        this.socket.emit('createPost', post);
    }

    // recieves a createPost socket with post data (the id)
    receiveCreatePostSocket() {
        return new Observable((observer: any) => {
            this.socket.on('createPost', (post: any) => {
                observer.next(post);
            });
        });
    }

    // emits a updatePost socket with post data (the id)
    emitUpdatePostSocket(post: any) {
        this.socket.emit('updatePost', post.id);
    }

    // recieves a updatePost socket with post data (the id)
    receiveUpdatePostSocket() {
        return new Observable((observer: any) => {
          this.socket.on('updatePost', (post: any) => {
            observer.next(post);
          });
        });
    }

    // emits a deletePost socket with post data (the id)
    emitDeletePostSocket(post: any) {
        this.socket.emit('deletePost', post);
    }

    // recieves a deletePost socket with post data (the id)
    receiveDeletePostSocket() {
        return new Observable((observer: any) => {
          this.socket.on('deletePost', (post: any) => {
            observer.next(post);
          });
        });
    }

}
