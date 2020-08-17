import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    helper = new JwtHelperService();
    constructor(private tokenService: TokenService, private router: Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.tokenService.getToken()).pipe(
            switchMap(token => {
                const headers = {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                };
                if (token) {
                    if (this.helper.isTokenExpired(token)) {
                        this.tokenService.deleteToken();
                        this.router.navigate(['']);

                    } else {
                        headers['Authorization'] = `Bearer ${token}`;
                    }
                }
                const duplicate = req.clone({ setHeaders: headers });
                return next.handle(duplicate);
            })
        );
    }
}
