import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

import { Menum } from '../models/menum';


@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss']
})
export class MainmenuComponent implements OnInit {

  title = "CARGOMAR PVT LTD";

  @ViewChild(MatSidenav, { static: true })
  sidenav!: MatSidenav;

  isMobile = false;
  isCollapsed = false;

  public isNavbarCollapsed = true;

  id: string = "";

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    public gs: GlobalService,
    private loginservice: LoginService
  ) { }

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false;
    } else {
      //this.sidenav.open();
      this.sidenav.toggle();
      this.isCollapsed = !this.isCollapsed;
    }
  }

  isOk(module: any, menu: any) {
    return module.name == menu.menu_module_name
  }


  LoadPage(rec: Menum) {
    let bFlag: boolean = false;
    this.getUrlID();

    var param = JSON.parse(rec.menu_route2);
    param.appid = this.gs.globalVariables.appid;
    console.log('Menu Navigation', rec.menu_route1, param);

    this.router.navigate([rec.menu_route1], { queryParams: param });
  }

  Logout() {
    this.loginservice.Logout();
  }

  logout() {
    this.loginservice.Logout();

  }

  getUrlID() {
    this.id = this.gs.getGuid();
  }





}
