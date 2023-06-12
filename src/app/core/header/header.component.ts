import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Menum } from '../models/menum';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';
import { RECOMPUTE_ACTION } from '@ngrx/store-devtools/src/reducer';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    public isNavbarCollapsed = true;
    public gs: GlobalService;
    title = "Pls Login";
    id: string = "";
    constructor(
        private router: Router,
        private gs1: GlobalService,
        private loginservice: LoginService) {
        this.gs = gs1;
    }

    LoadPage(rec: Menum) {
        let bFlag: boolean = false;
        this.getUrlID();

        var param = JSON.parse(rec.menu_route2);
        param.appid=  this.gs.globalVariables.tokenid;        
        console.log('Menu Navigation', rec.menu_route1, param);

        this.router.navigate([rec.menu_route1], { queryParams: param});
    }

    Logout() {

        this.loginservice.Logout();
        this.title = 'Pls Login';

        localStorage.removeItem ('menu');
        localStorage.removeItem('modules');
        localStorage.removeItem('gv');
        localStorage.removeItem('dv');
        localStorage.removeItem('access_token');
        localStorage.removeItem ('tcl');
        localStorage.removeItem ('tp');
        this.router.navigate(['login'], { replaceUrl: true });
    }

    getUrlID() {
        this.id = this.gs1.getGuid();
    }

}
