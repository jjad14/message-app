import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from '../../shared/mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
    enteredTitle = '';
    enteredContent = '';

    post: Post;

    isLoading = false;
    form: FormGroup;
    imagePreview: string;

    private mode = 'create';
    private postId: string;
    private authStatusSub: Subscription;

    constructor(public postsService: PostsService,
                public route: ActivatedRoute,
                private authService: AuthService) {}

    ngOnInit() {
        this.form = new FormGroup({
            title: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3), Validators.maxLength(175)]
            }),
            content: new FormControl(null, {
                validators: [Validators.required],
            }),
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        });

        // get authentication status
        this.authStatusSub = this.authService.getAuthStatus().subscribe(
            authStatus => {
                this.isLoading = false;
        });

        // check if user is creating a post or editing an existing post
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            // if their is a post id in the url (params) then its edit mode
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;

                // get post by the post id
                this.postsService.getPost(this.postId)
                    .subscribe(postData => {
                        this.isLoading = false;
                        this.post = {
                                    id: postData._id,
                                    title: postData.title,
                                    content: postData.content,
                                    imagePath: postData.imagePath,
                                    creator: postData.creator
                        };
                        // insert post data onto form fields
                        this.form.setValue({
                            title: this.post.title,
                            content: this.post.content,
                            image: this.post.imagePath
                        });
                        this.imagePreview = this.post.imagePath;
                    });
            // create mode
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    // image selection for both edit and create mode
    onImageSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();

        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    // save post
    onSavePost() {
        if (this.form.invalid) {
            return;
        }

        this.isLoading = true;
        // create mode - add new post
        if (this.mode === 'create') {
            this.postsService.addPost(
                this.form.value.title,
                this.form.value.content,
                this.form.value.image
            );
        // edit mode - update post
        } else {
            this.postsService.updatePost(
                this.postId,
                this.form.value.title,
                this.form.value.content,
                this.form.value.image
            );
        }
        this.form.reset();
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }
}
