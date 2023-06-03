
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from "rxjs/operators";
import { LoadingScreenService } from './loadingscreen.service';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {

    skippUrls = [
        '/to',
    ];

    activeRequests: number = 0;

    constructor(
        private loadingScreenService: LoadingScreenService,
        private router  :Router,
        private loginservice: LoginService
        ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let displayLoadingScreen = true;

        for (const skippUrl of this.skippUrls) {
            if (new RegExp(skippUrl).test(request.url)) {
                displayLoadingScreen = false;
                break;
            }
        }

        if (displayLoadingScreen) {
            if (this.activeRequests === 0) {
                this.loadingScreenService.startLoading();
            }
            this.activeRequests++;
            return next.handle(request).pipe(
                catchError ( err => {
                    if ( err.status == 401){
                        alert('Authorisation Token Expired');
                        this.Logout();
                    }
                    console.log('interceptor error ', err);
                    return throwError(err); 
                }),
                finalize(() => {
                    this.activeRequests--;
                    if (this.activeRequests === 0) {
                        this.loadingScreenService.stopLoading();
                    }
                })
            )
        }
        else {
            return next.handle(request);
        }
    };


    Logout() {

        this.loginservice.Logout();

        localStorage.removeItem ('menu');
        localStorage.removeItem('modules');
        localStorage.removeItem('gv');
        localStorage.removeItem('dv');
        localStorage.removeItem('access_token');
        localStorage.removeItem ('tcl');
        this.router.navigate(['login'], { replaceUrl: true });
    }


}


