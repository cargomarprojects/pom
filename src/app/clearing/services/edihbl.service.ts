import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { EdiHbl} from '../models/edihbl';
import { EdiService } from '../services/edi.service';

@Injectable({ providedIn: 'root' })
export class EdiHblService {

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
  RecordList: EdiHbl[] = [];
  TradingPartners: any[];

  EdiErrorList: [] = [];

  constructor(
    private http2: HttpClient,
    private mainService: EdiService,
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
    this.hblstatus = 'ALL';
    this.partnerid = 'ALL';
    this.rowstatus = "ALL";
    this.houseno = "";
    this.RecordList = []
    this.TradingPartners = [];
    this.EdiErrorList = [];
  }

  loadCombo() {
    this.TradingPartners = this.gs.TradingPartners;
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
      hblstatus: this.hblstatus,
      partnerid: this.partnerid,
      rowstatus: this.rowstatus,
      fileno: this.fileno,
      houseno: this.houseno,
      showdeleted: this.showdeleted
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


  Validate(_type: string) {

    let SearchData = {
      company_code: this.gs.globalVariables.comp_code,
      user_code: this.gs.globalVariables.user_code,      
      partnerid: this.partnerid,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.getValidate(SearchData)
      .subscribe(response => {
        this.mainService.EdiErrorList = response.list;
        if ( response.list.length >0 )
          alert('pls check the Error List tab to see the Missing Data');
        else
        alert('No Missing Data Found');
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  TransferBL(_type: string) {

    let SearchData = {
      type : _type,
      company_code: this.gs.globalVariables.comp_code,
      user_code: this.gs.globalVariables.user_code,      
      partnerid: this.partnerid,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.ProcessTransferBL(SearchData)
      .subscribe(response => {
        alert( response.status );
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
  }


//   TransferPOTracking(_type: string) {

//     let SearchData = {
//       type : _type,
//       company_code: this.gs.globalVariables.comp_code,
//       user_code: this.gs.globalVariables.user_code,      
//       partnerid: this.partnerid,
//     };

//     this.ErrorMessage = '';
//     this.InfoMessage = '';
//     this.ProcessTransferPOTracking(SearchData)
//       .subscribe(response => {
//         alert( response.status );
//       },
//         error => {
//           this.ErrorMessage = this.gs.getError(error);
//         });
//   }






  getList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Edi/Hbl/List', SearchData, this.gs.headerparam2('authorized'));
  }

  getValidate(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Edi/HBL/Validate', SearchData, this.gs.headerparam2('authorized'));
  }

  ProcessTransferBL(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Edi/HBL/TransferBL', SearchData, this.gs.headerparam2('authorized'));
  }

//   ProcessTransferPOTracking(SearchData: any) {
//     return this.http2.post<any>(this.gs.baseUrl + '/api/Edi/Order/TransferPOTracking', SearchData, this.gs.headerparam2('authorized'));
//   }

//   Process(SearchData: any) {
//     return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrderEdi/Process', SearchData, this.gs.headerparam2('authorized'));
//   }


}
