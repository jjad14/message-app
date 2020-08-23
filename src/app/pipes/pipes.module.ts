import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShortenPipe } from '../pipes/shorten.pipe';
import { FontPipe } from './font.pipe';

@NgModule({
    declarations: [
        ShortenPipe,
        FontPipe
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        ShortenPipe,
        FontPipe
    ]
})
export class PipesModule { }
