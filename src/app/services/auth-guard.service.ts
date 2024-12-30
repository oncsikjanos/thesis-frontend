import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    // Wait for the first non-undefined value from currentUserSignal
    return new Observable<boolean | UrlTree>(observer => {
      const checkAuth = setInterval(() => {
        const currentUser = this.authService.currentUserSignal();
        if (currentUser !== undefined) {
          clearInterval(checkAuth);
          if (!this.authService.isLoggedIn()) {
            observer.next(this.router.createUrlTree(['/auth'], {
              queryParams: { previousUrl: state.url }
            }));
          } else {
            observer.next(true);
          }
          observer.complete();
        }
      }, 100);
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    return new Observable<boolean | UrlTree>(observer => {
      const checkAuth = setInterval(() => {
        const currentUser = this.authService.currentUserSignal();
        if (currentUser !== undefined) {
          clearInterval(checkAuth);
          if (this.authService.isLoggedIn()) {
            observer.next(this.router.createUrlTree(['/'], {
              queryParams: { previousUrl: state.url }
            }));
          } else {
            observer.next(true);
          }
          observer.complete();
        }
      }, 100);
    });
  }
}
