import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { EdiOrder } from '../models/ediorder';

@Injectable({providedIn : 'root'})
export class EdiOrderService {


  selectcheckbox: boolean = false;
  
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  searchstring = "";
  ErrorMessage = "";
  InfoMessage = "";
 
  partnerid = '';
  rowstatus = "ALL";
  pono = "";
  RecordList: EdiOrder[] = [];
  TradingPartners : any [];

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
      this.page_rows = 30;

      this.loadCombo();
  }

  loadCombo(){

    this.TradingPartners = this.gs.TradingPartners;
    this.partnerid = "ALL";
    
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
      partnerid: this.partnerid,
      rowstatus: this.rowstatus,
      po: this.pono,
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
    return this.http2.post<any>(this.gs.baseUrl + '/api/Edi/Order/List', SearchData, this.gs.headerparam2('authorized'));
  }
  
  Process(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrderEdi/Process', SearchData, this.gs.headerparam2('authorized'));
  }
  
  UpdateOrdersList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrderEdi/UpdateOrdersList', SearchData, this.gs.headerparam2('authorized'));
  }
}

