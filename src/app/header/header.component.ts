import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    userIsAuthenticated = false;
    private authSubscription: Subscription;

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit() {
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authSubscription = this.authService
            .getAuthStatus()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            });
    }

    onLogout() {
        this.authService.logout();
    }

    // application name link navs to root page - if already on it then reload
    reloadComponent() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/']);
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }


}
