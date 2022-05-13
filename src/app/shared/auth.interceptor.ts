import { Injectable } from "@angular/core";
import {HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent} from "@angular/common/http";
import { TokenService } from "../shared/token.service";
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable, throwError} from "rxjs";
import {AuthService} from "./auth.service";
import {AppComponent} from "../app.component";
import {AuthStateService} from "./auth-state.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private oldToken: string = '';
  private app!: AppComponent;
  private authStateService!: AuthStateService;


  constructor(private tokenService: TokenService,private router: Router, private authService: AuthService) { }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      this.oldToken = this.tokenService.getToken() ?? '';
      if (this.oldToken){
        return this.authService.refreshToken().pipe(
          switchMap((token: any) => {
            console.log(token);
            this.isRefreshing = false;
            this.tokenService.handleData(token.access_token);
            this.refreshTokenSubject.next(token.access_token);
            return next.handle(this.addTokenHeader(request, token.access_token));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.authStateService.setAuthState(false);
            this.tokenService.removeToken();
            return throwError(err);
          })
        );
      }else{
        this.router.navigate(['login'])
      }
    }else{
      this.tokenService.removeToken();
      this.router.navigate(['login'])
    }


    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(
        this.addTokenHeader(request, token)
      ))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    const accessToken = this.tokenService.getToken();
    request = request.clone({
      setHeaders: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json"
      }
    });

    return request;
  }

  // intercept(req: HttpRequest<any>, next: HttpHandler) {
  //   const accessToken = this.tokenService.getToken();
  //   req = req.clone({
  //     setHeaders: {
  //       Authorization: "Bearer " + accessToken,
  //       "Content-Type": "application/json"
  //     }
  //   });


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
      let authReq = req;
      const token = this.tokenService.getToken();
      if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !authReq.url.includes('auth/signin') && error.status === 401) {
        return this.handle401Error(authReq, next);
      }
      return throwError(error);
    }));
  }


  //   return next.handle(req).pipe( tap(() => {},
  //     (err: any) => {
  //       if (err instanceof HttpErrorResponse || !accessToken) {
  //         if (err.status !== 401) {
  //           return;
  //         }
  //         this.router.navigate(['login']);
  //       }
  //     }));
  // }
}
