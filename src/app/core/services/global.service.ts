import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Router } from '@angular/router';
import { GlobalData } from '../models/globaldata';
import { GlobalVariables } from '../models/globalvariables';
import { DefaultValues } from '../models/defaultvalues';
import { Menum } from '../models/menum';
import { Modulem } from '../models/modulem';
import { Tracking_Caption } from '../../clearing/models/tracking_caption';
import { Subject } from 'rxjs';

@Injectable()
export class GlobalService {
  public Token: string;
  public Company_Name: string;
  public IsLoginSuccess: boolean = false;
  public IsAuthenticated: boolean = false;
  public Access_Token: string;
  public ExpiryDate: Date;
  public globalData: GlobalData;
  public globalVariables: GlobalVariables;
  public defaultValues: DefaultValues;

  private _toast: Subject<string[]> = new Subject<string[]>();
  public readonly toast$ = this._toast.asObservable();


  public baseLocalServerUrl: string = "http://localhost:8080";
  public baseUrl: string = "http://localhost:5000";

  //public baseUrl: string = "https://localhost:44340";

  //public baseLocalServerUrl: string = "";
  //public baseUrl: string = "";
  public DATE_DISPLAY_FORMAT = "dd-MMM-yyyy";

  public USER_DATA_LIST = [
    { 'code': 'GENERAL-USER', 'name': 'GENERAL USER' },
    { 'code': 'AGENT', 'name': 'AGENT' },
    { 'code': 'SHIPPER', 'name': 'SHIPPER' },
    { 'code': 'CONSIGNEE', 'name': 'CONSIGNEE' },
    { 'code': 'BUYING-AGENT', 'name': 'BUYING AGENT' }
  ];

  // change this is false in production and update
  public isolderror: boolean = false;
  public HideDisabledTrackingDate: boolean = true;

  public Modules: Modulem[] = [];
  public MenuList: Menum[] = [];
  public trkCaptionList: Tracking_Caption[] = [];

  public TradingPartners: any[];

  constructor(
    private http2: HttpClient,
    private location: Location,
    private router: Router) {
    this.Company_Name = "";
    this.globalVariables = new GlobalVariables;
    this.globalData = new GlobalData;
    this.InitdefaultValues();
  }

  public getGuid(): string {
    let uuid = UUID.UUID();
    return uuid.toUpperCase();
  }

  public getPagetitle(menucode: string): string {
    return this.MenuList.find(f => f.menu_code == menucode).menu_name;
  }

  public getMenu(menucode: string): Menum {
    return this.MenuList.find(f => f.menu_code == menucode);
  }

  public getError(error: any) {
    if (this.isolderror)
      return JSON.parse(error.error).Message;
    else
      return error.error.Message;
  }
  public getErrorArray(error: any) {
    return error.split('~');
  }
  /*
  public headerparam(type: string, company_code: string = '') {
    let headers = new Headers();
    let options = new RequestOptions({
      headers: headers,
    });
    if (type == 'login')
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
    if (type == 'authorized') {
      headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers.append('Content-Type', 'application/json');
    }

    if (type == 'authorized-fileupload') {
      headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers.delete('Content-Type');
    }

    if (type == 'anonymous') {
      headers.append('Content-Type', 'application/json');

    }
    if (type == 'excel') {
      headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/x-msexcel');
      options.responseType = ResponseContentType.Blob;
    }
    if (company_code != '')
      headers.append('company-code', company_code);
    return options;
  }

  */


  public headerparam2(type: string, company_code: string = '') {
    let headers = new HttpHeaders();



    if (type == 'login')
      headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    if (type == 'authorized') {
      headers = headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers = headers.append('Content-Type', 'application/json');
    }

    if (type == 'authorized-fileupload') {
      headers = headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers = headers.delete('Content-Type');
    }

    if (type == 'anonymous') {
      headers = headers.append('Content-Type', 'application/json');

    }
    if (type == 'excel') {
      headers = headers.append('Authorization', 'Bearer ' + this.Access_Token);
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Accept', 'application/x-msexcel');
      //options.responseType = ResponseContentType.Blob;
    }
    if (company_code != '')
      headers = headers.append('company-code', company_code);

    const options = {
      headers: headers,
    };

    return options;
  }


  public ClosePage(sPage: string, IsCloseButton = false) {
    this.location.back();
  }

  public LoadCombo() {

    this.LoadTradingPartners();

  }

  public LoadTradingPartners() {

    let SearchRecord = {
      table: 'PARAM',
      comp_code: this.globalVariables.comp_code,
      param_type: 'PARAM'
    }
    this.SearchRecord(SearchRecord).subscribe(
      response => {
        this.TradingPartners = response.param;
        this.TradingPartners.push({ param_pkid: '', param_code: 'ALL', param_name: 'ALL', param_id1: '' })

        //response.param;

        localStorage.setItem('tp', JSON.stringify(this.TradingPartners));
      },
      error => {
        alert(this.getError(error));
      });
  }

  public SendEmail(SearchData: any) {
    return this.http2.post<any>(this.baseUrl + "/api/Email/Common", SearchData, this.headerparam2('authorized'));
  }

  public SearchRecord(SearchData: any) {
    return this.http2.post<any>(this.baseUrl + "/api/Admin/Lov/SearchRecord", SearchData, this.headerparam2('authorized'));
  }

  public DownloadFile(report_folder: string, filename: string, filetype: string, filedisplayname: string = 'N') {
    let body = 'report_folder=' + report_folder + '&filename=' + filename + '&filetype=' + filetype + '&filedisplayname=' + filedisplayname;
    window.open(this.baseUrl + '/api/Admin/User/DownloadFile?' + body, "_blank");
  }

  /*
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.DownloadFile(this.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  */

  public roundNumber(_number: number, _precision: number) {
    var factor = Math.pow(10, _precision);
    var tempNumber = _number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  public InitdefaultValues() {

    this.defaultValues = new DefaultValues;
    this.defaultValues.today = new Date().toISOString().slice(0, 10);
    this.defaultValues.monthbegindate = this.getNewdate(0);
    this.defaultValues.lastmonthdate = this.getNewdate(30);//get today -30 days

    this.defaultValues.root_folder = '';
    this.defaultValues.root_folder = 'c://documents/alldocs/';
    this.defaultValues.sub_folder = '2021';

  }
  public getNewdate(_days: number) {
    var nDate = new Date();
    if (_days <= 0)
      nDate.setDate(1);
    else
      nDate.setDate(nDate.getDate() - _days);
    return nDate.toISOString().slice(0, 10);
  }

  public getGstType(_gstin: string, _gstin_state_code: string, isSez: boolean, bISGT_Exception = false) {
    let _type: string = '';
    if (_gstin.length == 15) {
      if (_gstin.substring(0, 2) == this.defaultValues.gstin_state_code)
        _type = 'INTRA-STATE';
      else
        _type = 'INTER-STATE';
    }
    else if (_gstin_state_code.length == 2) {
      if (_gstin_state_code == this.defaultValues.gstin_state_code)
        _type = 'INTRA-STATE';
      else
        _type = 'INTER-STATE';
    }
    if (isSez)
      _type = 'INTER-STATE';

    if (bISGT_Exception) {
      if (_type == 'INTRA-STATE')
        _type = 'INTER-STATE';
    }

    return _type;
  }


  public roundWeight(_number: number, _category: string) {

    let _precision: number;
    _precision = 0;
    if (_category == "CBM")
      _precision = 3;
    else if (_category == "NTWT")
      _precision = 3;
    else if (_category == "GRWT")
      _precision = 3;
    else if (_category == "CHWT")
      _precision = 3;
    else if (_category == "PCS")
      _precision = 3;
    else if (_category == "PKG")
      _precision = 0;
    else if (_category == "EXRATE")
      _precision = 2;
    else if (_category == "RATE")
      _precision = 2;
    else if (_category == "AMT")
      _precision = 2

    var factor = Math.pow(10, _precision);
    var tempNumber = _number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  public IsBranchWiseCodeOK(Branch_Type: string, accode: string, maincode: string): Boolean {
    let bRet: boolean = true;
    let codetype: string = '';
    if (accode != maincode) {

      if (maincode == '1101' || maincode == '1102' || maincode == '1103' || maincode == '1104' || maincode == '1105' || maincode == '1106' || maincode == '1107')
        codetype = 'SEA';
      if (maincode == '1301' || maincode == '1302' || maincode == '1303' || maincode == '1304' || maincode == '1305' || maincode == '1306' || maincode == '1307')
        codetype = 'SEA';
      if (maincode == '1201' || maincode == '1202' || maincode == '1203' || maincode == '1204' || maincode == '1205')
        codetype = 'AIR';
      if (maincode == '1401' || maincode == '1402' || maincode == '1403' || maincode == '1404' || maincode == '1405')
        codetype = 'AIR';
      if (Branch_Type == "BOTH") {
        codetype = 'BOTH';
      }
      if (codetype == 'SEA' || codetype == 'AIR' || codetype == 'BOTH') {
        if (Branch_Type != codetype) {
          bRet = false;
        }
      }
    }
    return bRet;
  }


  Naviagete(menu_route: string, jsonstring: string) {
    let id = this.getGuid();
    this.router.navigate([menu_route], { queryParams: { id: id, parameter: jsonstring }, replaceUrl: false });
  }


  Naviagate2(menu_route: string, param: any) {
    this.router.navigate([menu_route], { queryParams: param });
  }


  getTokenExpiryDate(seconds: number = 0) {
    let dt = new Date();
    const milliseconds = seconds * 1000; // 1 seconds = 1000 milliseconds
    dt = new Date(dt.getTime() + milliseconds);
    return dt;
  }

  isTokenExpired(expiryDate: Date) {
    let dt = new Date();
    if (dt >= expiryDate)
      return true;
    else
      return false;
  }



  getParameter(theParameter): string {
    var params = window.location.search.substr(1).split('&');
    for (var i = 0; i < params.length; i++) {
      var p = params[i].split('=');
      if (p[0] == theParameter) {
        return decodeURIComponent(p[1]);
      }
    }
    return '';

  }


  public isNull(iData: any): boolean {
    if (iData == null || iData == undefined)
      return true;
    else
      return false;
  }

  public isBlank(iData: any): boolean {
    if (iData == null || iData == undefined || iData == '')
      return true;
    else
      return false;
  }

  public isZero(iData: any): boolean {
    if (iData == null || iData == undefined || iData == 0)
      return true;
    else
      return false;
  }

  public getTrackDate(_type: string) {
    var REC = this.trkCaptionList.find(rec => rec.trk_caption_code == _type);
    if (REC != null) {
      if (REC.trk_enabled)
        return REC.trk_caption_code;
      else
        return '';
    }
    else
      return '';
  }

  public getDateddMMMyyyy(_sdate: string) {
    if (_sdate.indexOf("-") >= 0) {
      var arrmon = _sdate.split('-');
      if (+arrmon[0] > 1000) {
        if (arrmon[2].length == 2)
          _sdate = arrmon[2] + "-" + this.getMonName(+arrmon[1]) + "-" + arrmon[0];
        else
          _sdate = "0" + arrmon[2] + "-" + this.getMonName(+arrmon[1]) + "-" + arrmon[0];
      }
    }
    return _sdate;
  }

  getMonName(_mn: number) {
    let mName = "";
    if (_mn == 1)
      mName = "JAN";
    else if (_mn == 2)
      mName = "FEB";
    else if (_mn == 3)
      mName = "MAR";
    else if (_mn == 4)
      mName = "APR";
    else if (_mn == 5)
      mName = "MAY";
    else if (_mn == 6)
      mName = "JUN";
    else if (_mn == 7)
      mName = "JUL";
    else if (_mn == 8)
      mName = "AUG";
    else if (_mn == 9)
      mName = "SEP";
    else if (_mn == 10)
      mName = "OCT";
    else if (_mn == 11)
      mName = "NOV";
    else if (_mn == 12)
      mName = "DEC";
    return mName;
  }

  getURLParam(param: string) {
    return new URLSearchParams(window.location.search).get(param);
  }

  public checkAppVersion() {
    const _id = this.getURLParam('appid');
    if (this.globalVariables.appid == _id) {
      return true;
    }
    if (_id == undefined || _id == null || _id == '')
      alert('Page Expired, APPID not found');
    else
      alert('Page Expired');
    this.logout();
    return false;
  }


  logout() {
    this.IsLoginSuccess = false;
    this.IsAuthenticated = false;
    this.Access_Token = '';

    localStorage.removeItem('menu');
    localStorage.removeItem('modules');
    localStorage.removeItem('gv');
    localStorage.removeItem('dv');
    localStorage.removeItem('access_token');
    localStorage.removeItem('tcl');
    localStorage.removeItem('tp');

    this.router.navigate(['login'], { replaceUrl: true });

  }


  public showToastScreen(msg: string[]) {
    this._toast.next(msg);
  }
  public hideToastScreen() {
    this._toast.next([]);
  }

  trimAll(obj: any) {
    if (obj == null || obj == undefined)
      return obj;
    return obj.toString().trim();
  }

}
