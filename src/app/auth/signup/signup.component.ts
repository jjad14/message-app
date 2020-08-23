import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { mimeType } from 'src/app/shared/mime-type.validator';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
    isLoading = false;
    form: FormGroup;
    imagePreview: string;

    private authStatuSub: Subscription;

    constructor(public authService: AuthService) {}

    ngOnInit() {
        // Form definition
        this.form = new FormGroup({
            username: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(4), Validators.maxLength(30)]
            }),
            email: new FormControl(null, {
                validators: [Validators.required, Validators.email],
            }),
            firstName: new FormControl(null, {
                validators: [Validators.required, Validators.maxLength(50)]
            }),
            lastName: new FormControl(null, {
                validators: [Validators.required, Validators.maxLength(50)],
            }),
            gender: new FormControl(null, {
                validators: [Validators.required],
            }),
            password: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(8), Validators.maxLength(20)],
            })
        });

        this.authStatuSub = this.authService.getAuthStatus().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        );
    }

    // passing form values to create user
    onSignup() {
        if (this.form.invalid) {
            return;
        }
        this.isLoading = true;
        this.authService.createUser(
            this.form.value.username,
            this.form.value.email,
            this.form.value.firstName,
            this.form.value.lastName,
            this.form.value.gender,
            this.form.value.password
        );
    }

    ngOnDestroy() {
        this.authStatuSub.unsubscribe();
    }
}
