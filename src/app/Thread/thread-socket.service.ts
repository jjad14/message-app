import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
})
export class ThreadSocketService {

        // service that emits sockets
        constructor(private socket: Socket) { }

        // emits a createPost socket with post data (the id)
        emitCreateCommentSocket(comment: any) {
            this.socket.emit('createComment', comment);
        }

        // recieves a createPost socket with post data (the id)
        receiveCreateCommentSocket() {
            return new Observable((observer: any) => {
                this.socket.on('createComment', (comment: any) => {
                    observer.next(comment);
                });
            });
        }
}
