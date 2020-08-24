import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { ThreadComponent } from './thread.component';
import { AngularMaterialModule } from '../angular-material.module';
import { PipesModule } from '../pipes/pipes.module';

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
        PipesModule
    ]
})
export class ThreadModule {}
