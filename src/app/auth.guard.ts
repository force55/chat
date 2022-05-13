import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "./shared/auth.service";
import {TokenService} from "./shared/token.service";
import {AlertService} from "./alert";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public tokenService: TokenService, public router: Router,public  alertService: AlertService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.tokenService.isLoggedIn() !== true) {
      this.alertService.error('Access Denied, Login is Required to Access This Page!', {
        autoClose: true,
        keepAfterRouteChange: true
      })
      this.router.navigate(['login']);
    }
    return true;
  }

}
