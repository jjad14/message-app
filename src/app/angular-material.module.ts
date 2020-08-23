import { NgModule } from '@angular/core';
import {
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatDividerModule
  } from '@angular/material';

@NgModule({
    // can remove imports and just have exports - same thing
    // imports: [
    //     MatInputModule,
    //     MatCardModule,
    //     MatButtonModule,
    //     MatToolbarModule,
    //     MatExpansionModule,
    //     MatProgressSpinnerModule,
    //     MatPaginatorModule,
    //     MatDialogModule
    // ],
    exports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule,
        MatDividerModule
    ]
})
export class AngularMaterialModule { }
