
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, EMPTY, from, Observable, subscribeOn, switchMap, take, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()

export class AuthIntercepror implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {

  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return this.addToken(req, next).pipe(catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        switch (err.status) {
          case 401:   // refresh token is needed
            if (req.url.includes('login') || req.url.includes('register')) throwError(() => err);
            return this.handle_401_Error(req, next);
          case 403:   // refresh token is expired  user has to login again to get a new refresh token
            return this.logOutUser();
          default: //any other error like localStorage is cleared
            return throwError(() => err);
        }
      } else { return throwError(() => err) }
    }))
  }

  handle_401_Error(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refreshToken()
      .pipe(take(1), switchMap(() => {
        return this.addToken(req, next);
      }))
  }

  addToken(req: HttpRequest<any>, next: HttpHandler) {
    const clonnedReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.authService.getAccessToken(),
      }
    })
    return next.handle(clonnedReq)
  }

  logOutUser() {
    this.authService.logOut()
    return from(EMPTY)
  }
}
