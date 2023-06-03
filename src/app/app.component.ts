import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { GlobalService } from './core/services/global.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
    title = 'Application Root Page';
    loading = false;

    sub: any;

    constructor(
        private gs: GlobalService,
        private router: Router
    ) {
        this.sub = this.router.events.subscribe((event: Event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.loading = true;
                    break;
                }
                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.loading = false;
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }


    ngOnInit() {

        if (environment.production) {
            this.router.navigate(['login'], { replaceUrl: true });            
        }
        else {
            if (localStorage.length > 0) {
                if (localStorage.getItem('access_token')) {
                    this.gs.ExpiryDate = new Date(localStorage.getItem('expiry_date'));
                    if ( this.gs.isTokenExpired(this.gs.ExpiryDate)){
                        this.router.navigate(['login'], { replaceUrl: true });            
                        return; 
                    }
                    this.gs.MenuList = JSON.parse(localStorage.getItem('menu'));
                    this.gs.Modules = JSON.parse(localStorage.getItem('modules'));
                    this.gs.globalVariables = JSON.parse(localStorage.getItem('gv'));
                    this.gs.defaultValues = JSON.parse(localStorage.getItem('dv'));
                    this.gs.TradingPartners = JSON.parse(localStorage.getItem('tp'));
                    this.gs.trkCaptionList = JSON.parse(localStorage.getItem('tcl'));
                    this.gs.Access_Token = localStorage.getItem('access_token');
                    this.gs.Company_Name = localStorage.getItem('company_name');
                    if (this.gs.Access_Token) {
                        this.gs.IsAuthenticated = true;
                        this.gs.IsLoginSuccess = true;
                    }
                }
            }
        }

    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
