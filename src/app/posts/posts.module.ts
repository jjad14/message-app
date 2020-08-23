import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { PipesModule } from '../pipes/pipes.module';
import { environment } from 'src/environments/environment';

const socketIoConfig: SocketIoConfig = {
  url: 'http://localhost:3000', options: {}
};
// url: 'http://localhost:3000', options: {}
//   url: environment.apiUrl, options: {}

@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        PipesModule,
        SocketIoModule.forRoot(socketIoConfig)
    ]
})
export class PostsModule { }
