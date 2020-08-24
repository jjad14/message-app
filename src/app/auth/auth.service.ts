import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';
import { User } from './user.model';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private userName: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getUserName() {
        return this.userName;
    }

    getAuthStatus() {
        return this.authStatusListener.asObservable();
    }

    // Create user after signup
    createUser(
        username: string,
        email: string,
        firstName: string,
        lastName: string,
        gender: string,
        password: string) {

        const authData: AuthData = {username, email, firstName, lastName, gender, password};

        this.http.post(BACKEND_URL + '/signup', authData)
            .subscribe(() => {
                this.router.navigate(['/']);
            }, error => {
                this.authStatusListener.next(false);
            });
    }

    // login user
    loginUser(email: string, password: string) {
        const authData: AuthData = {username: null, email, firstName: null, lastName: null, gender: null, password};

        // expect token in response
        this.http.post<{
            token: string,
            expiresIn: number,
            userId: string,
            username: string }>(
            BACKEND_URL + '/login', authData)
            .subscribe(res => {
                const token = res.token;
                this.token = token;

                // token exists
                if (token) {
                    const expiresInDuration = res.expiresIn;

                    this.setAuthTimer(expiresInDuration);

                    this.isAuthenticated = true;
                    this.userId = res.userId;
                    this.userName = res.username;

                    this.authStatusListener.next(true);

                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);

                    this.saveAuthData(token, expirationDate, this.userId, this.userName);
                    this.router.navigate(['/']);
                }
            }, error => {
                this.authStatusListener.next(false);
            });
    }

    // get a single user
    getUser(id: string) {
        return this.http.get<{
            userData: User
        }>(BACKEND_URL + '/profile/' + id);
    }

    // Update username and/or email
    updateUser(id: string, user: User) {
        const userData: User = {
            id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender
        };

        this.http
        .put(BACKEND_URL + '/profile/' + id, userData)
        .subscribe(response => {
            // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            //     this.router.navigate(['/profile']);
            // });
        });
    }

    // delete profile by userId
    deleteProfile(id: string) {
        this.http
        .delete(BACKEND_URL + '/' + id)
        .subscribe(response => {
            this.logout();
        });
    }

    //  automatically authenticate the user
    autoAuthUser() {
        const authInfo = this.getAuthData();

        if (!authInfo) {
            return;
        }

        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

        if (expiresIn > 0) {
            this.token = authInfo.token;
            this.isAuthenticated = true;
            this.userId = authInfo.userId;
            this.userName = authInfo.username;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    // logout user - clear authdata and redirect to root page
    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null;
        this.userName = null;

        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    // Set Timer for token expiration
    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    // Save token to local storage
    private saveAuthData(token: string, expirationDate: Date, userId: string, username: string) {
        // accessing local storage
        localStorage.setItem('token', token);
        // toISOString is a serialized and standard style version of the date which I then can use to recreate it
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
    }

    // Clear local storage
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    }

    // Get Token from local storage
    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');

        if (!token || !expirationDate) {
            return;
        }

        return {
            token,
            expirationDate: new Date(expirationDate),
            userId,
            username
        };
    }
}
