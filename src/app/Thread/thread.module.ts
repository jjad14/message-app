import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { ThreadComponent } from './thread.component';
import { AngularMaterialModule } from '../angular-material.module';
import { PipesModule } from '../pipes/pipes.module';
import { environment } from 'src/environments/environment';

const socketIoConfig: SocketIoConfig = {
    url: 'http://localhost:3000', options: {}
  };

@NgModule({
    declarations: [
        ThreadComponent
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
export class ThreadModule {}
