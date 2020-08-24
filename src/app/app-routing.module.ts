import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { ProfileComponent } from './profile/profile.component';
import { ThreadComponent } from './Thread/thread.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
    { path: 'thread/:postId', component: ThreadComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    // Old syntax: loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
    { path: '**', component: PostListComponent }
];
//     imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
