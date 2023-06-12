import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Companym } from '../models/company';
import { GlobalService } from '../services/global.service';
import { LoginService } from '../services/login.service';

import { AppState } from 'src/app/reducers';
import { Store } from '@ngrx/store';

// import * as fromorderlist from 'src/app/clearing/orderlist/list/store/orderlist.actions';
import * as fromorderedit from 'src/app/clearing/orderlist/edit/store/orderedit.actions';
import { HouseListService } from 'src/app/clearing/services/houselist.service';
import { EdiHblService } from 'src/app/clearing/services/edihbl.service';
import { EdiOrderService } from 'src/app/clearing/services/ediorder.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  // login screen 2

  errorMessage: string;
  ErrorExternalLogin: string = '';
  errorMessageVersion: string = '1.346';
  software_version_string: string = '1.346';

  username: string = '';
  password: string = '';
 

  server_software_version_string: string = '';
  showloginbutton: boolean = true;

  company_code: string = '';

  loading = false;
  showlogin = false;

  CompanyList: Companym[] = [];

  public gs: GlobalService;

  constructor(
    private router: Router,
    private gs1: GlobalService,
    private store: Store<AppState>,
    private loginservice: LoginService,
    private hs: HouseListService,
    private edihs: EdiHblService,
    private ediord: EdiOrderService 

  ) {

    this.username = 'admin';
    this.password = 'admin';

    // this.store.dispatch(fromorderlist.RESET());
    this.store.dispatch(fromorderedit.RESET());
    this.gs = gs1;
    this.LoadCombo();
    this.InitAllService();
  }

  InitAllService()
  {
    this.hs.init();
    this.edihs.init();
    this.ediord.init();
  }

  LoadCombo() {
    this.loading = true;
    let SearchData = {
      userid: ''
    };

    this.loginservice.LoadCompany(SearchData)
      .subscribe(response => {
        this.CompanyList = response.list;
        this.server_software_version_string = response.version;

        if (this.software_version_string != this.server_software_version_string) {
          this.errorMessage = "New Version Available, Kindly Clear Browser History";

          this.showloginbutton = false;
        }

        this.CompanyList.forEach(rec => {
          if (this.company_code == '')
            this.company_code = rec.comp_code;
        });
        this.loading = false;
        this.showlogin = true;
      },
        error => {
          this.loading = false;
          this.showlogin = false;
          this.errorMessage = error.error.error_description;
        });
  }

  Login() {

    if (!this.username) {
      this.errorMessage = 'Login ID Cannot Be Blank';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Password Cannot Be Blank';
      return;
    }
    if (!this.company_code) {
      this.errorMessage = 'Please Select Company';
      return;
    }

    if (this.software_version_string != this.server_software_version_string) {
      this.errorMessage = "New Version Available, Kindly Clear Browser History";
      this.showloginbutton = false;
      return;
    }


    this.username = this.username.toUpperCase();
    this.password = this.password.toUpperCase();

    this.loading = true;

    this.gs.globalVariables.appid =  this.gs.getGuid();

    this.loginservice.Login(this.username, this.password, this.company_code)
      .subscribe(response => {
        this.loading = false;
        let user = response;

        if (user && user.access_token) {
          this.gs.ExpiryDate = this.gs.getTokenExpiryDate(response.expires_in);
          console.log('Expiry Date ', this.gs.ExpiryDate);
          this.gs.Access_Token = user.access_token;
          this.gs.globalVariables.user_pkid = user.userpkid;
          this.gs.globalVariables.user_code = user.usercode;
          this.gs.globalVariables.user_name = user.userName;
          this.gs.globalVariables.user_email = user.useremail;
          this.gs.globalVariables.user_company_id = user.usercompanyid;
          this.gs.globalVariables.user_company_code = user.usercompanycode;
          this.gs.globalVariables.user_branch_id = user.userbranchid;
          this.gs.globalVariables.sman_id = user.usersmanid;
          this.gs.globalVariables.sman_name = user.usersmanname;
          this.gs.baseLocalServerUrl = user.userlocalserver;
          this.gs.globalVariables.ipaddress = user.useripaddress;
          this.gs.globalVariables.tokenid = user.usertokenid;
          this.gs.globalVariables.user_branch_user = user.user_branch_user;
          this.gs.globalVariables.branch_code = '';
          this.gs.globalVariables.year_code = '';
          this.gs.IsLoginSuccess = true;
        }

        if (this.gs.IsLoginSuccess) {
          this.errorMessage = "Login Success";
          this.LoadMenu();
        }
        else {
          this.errorMessage = "Login Failed";
        }
      },
        error => {
          this.loading = false;
          this.errorMessage = error.error.error_description;
        });
  }

  LoadMenu() {
    let SearchData = {
      userid: this.gs.globalVariables.user_pkid,
      usercode: this.gs.globalVariables.user_code,
      compid: this.gs.globalVariables.user_company_id,
      compcode: this.gs.globalVariables.user_company_code,
      branchid: '',
      yearid: '',
      ipaddress: this.gs.globalVariables.ipaddress,
      tokenid: this.gs.globalVariables.tokenid
    };

    this.loading = true;
    this.loginservice.LoadMenu(SearchData)
      .subscribe(response => {
        this.gs.IsAuthenticated = true;
        this.loading = false;
        this.gs.MenuList = response.list;
        this.gs.Modules = response.modules;
        this.gs.trkCaptionList= response.trklist;

        let data = response.data;
        this.gs.globalVariables.comp_pkid = data.comp_pkid;
        this.gs.globalVariables.comp_code = data.comp_code;
        this.gs.globalVariables.comp_name = data.comp_name;
        this.gs.Company_Name = data.comp_name;
        this.gs.globalVariables.report_folder = data.report_folder;

        this.gs.InitdefaultValues();

        localStorage.setItem('expiry_date', this.gs.ExpiryDate.toString());
        localStorage.setItem('access_token', this.gs.Access_Token);
        localStorage.setItem('company_name', this.gs.Company_Name);
        localStorage.setItem('menu', JSON.stringify(this.gs.MenuList));
        localStorage.setItem('modules', JSON.stringify(this.gs.Modules));
        localStorage.setItem('gv', JSON.stringify(this.gs.globalVariables));
        localStorage.setItem('dv', JSON.stringify(this.gs.defaultValues));
        localStorage.setItem('tcl', JSON.stringify(this.gs.trkCaptionList));

        this.gs.LoadCombo();

        this.router.navigate(['home'], { replaceUrl: true });
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }
  checkLocalServer() {

    this.loading = true;
    let SearchData = {
      user: "",
    };

    this.loginservice.CheckLocalServer(SearchData)
      .subscribe(response => {
        this.loading = false;

        if (response == null) {
          this.ErrorExternalLogin = 'External Login Not Allowed';
        }
        else if (response == "OK") {
          this.errorMessage = "Login Success";
          this.router.navigate(['loginbranch'], { replaceUrl: true });
        }
        else {
          this.ErrorExternalLogin = 'External Login Not Allowed';
        }
      },
        error => {
          this.loading = false;
          this.ErrorExternalLogin = 'External Login Not Allowed';
        });

  }

  Logout() {
    this.loginservice.Logout();
    this.errorMessage = 'Pls Login';
  }





}
