import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

//import 'rxjs/add/operator/map';

import { GlobalService } from './global.service';
import { HouseListService } from '../../Clearing/services/houselist.service';

@Injectable()
export class LoginService {
  constructor(
    private http2: HttpClient,
    private gs: GlobalService,
    private hs: HouseListService
  ) {
  }


  Login(username: string, password: string, company_code: string) {

    this.initAllService();

    var body = 'grant_type=' + 'password' + '&username=' + username + '&password=' + password;
    return this.http2.post<any>(this.gs.baseUrl + "/Token", body, this.gs.headerparam2('login', company_code));
  }

  initAllService() {
    this.hs.init();
  }

  Logout() {
    this.gs.IsLoginSuccess = false;
    this.gs.IsAuthenticated = false;
    this.gs.Access_Token = '';
  }

  LoadMenu(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Admin/User/LoadMenu", SearchData, this.gs.headerparam2('authorized'));
  }

  LoadBranch(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Admin/User/LoadBranch", SearchData, this.gs.headerparam2('authorized'));
  }

  LoadCompany(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Admin/User/LoadCompany", SearchData, this.gs.headerparam2('anonymous'));
  }

  LoadYear(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + "/api/Admin/User/LoadYear", SearchData, this.gs.headerparam2('authorized'));
  }

  CheckLocalServer(SearchData: any) {
    return this.http2.post<any>(this.gs.baseLocalServerUrl + "/api/values/GetVersion", SearchData, this.gs.headerparam2('anonymous'));
  }



}


