import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { BlList} from '../models/bllist';

@Injectable({ providedIn: 'root' })
export class HouseListService {

  selectcheckbox: boolean = false;
  showdeleted: boolean = false;
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;
  searchstring = "";
  ErrorMessage = "";
  InfoMessage = "";
  hblstatus = '';
  partnerid = '';
  rowstatus = "";
  fileno = "";
  houseno = "";
  masterno = "";
  pkid="";
  RecordList: BlList[] = [];
  TradingPartners: any[];
  EdiErrorList: [] = [];
  Record: BlList = new BlList;

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
    this.init();
    this.loadCombo();
  }

  init() {
    this.selectcheckbox = false;
    this.page_count = 0;
    this.page_current = 0;
    this.page_rows = 30;
    this.page_rowcount = 0;
    this.searchstring = "";
    this.ErrorMessage = "";
    this.InfoMessage = "";
    this.houseno = "";
    this.masterno = "";
    this.RecordList = []
   
  }

  loadCombo() {
    // this.TradingPartners = this.gs.TradingPartners;
  }

  List(_type: string) {

    let SearchData = {
      type: _type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      user_code: this.gs.globalVariables.user_code,
      houseno: this.houseno,
      masterno:this.masterno
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.getList(SearchData)
      .subscribe(response => {
        this.RecordList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
  }



  

  getList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/House/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/House/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }


}

