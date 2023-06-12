
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Joborderm, SearchQuery, JobOrderModel } from '../models/joborder';
import { GlobalService } from '../../core/services/global.service';
import { JobOrder_VM } from '../models/joborder';
import { PageQuery } from 'src/app/shared/models/pageQuery';

@Injectable({ providedIn: 'root' })
export class OrderListService {
  
  title = 'ORDER LIST';
  menuid: string = '';
  type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  total = 0;
  ErrorMessage = "";
  InfoMessage = "";
  loading = false;
  where_agent = "CUST_IS_AGENT = 'Y'";
  where_shipper = "CUST_IS_SHIPPER = 'Y'";
  where_consignee = "CUST_IS_CONSIGNEE = 'Y'";
  where_buy_agent = "CUST_IS_BUY_AGENT = 'Y'";

  SortList: any[];
  private _record: JobOrderModel;

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {

    // this.record = {};
    this.ClearInit();
  }

  public get record() {
    return this._record;
  }

  public set record(value: any) {
    this._record = value;
  }

  InitComponent() {
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
     this.List("NEW");
  }

  public ClearInit() {
    this.record = <JobOrderModel>{
      urlid: '',
      message: '',
      isError: false,
      records: [],
      searchQuery: <SearchQuery>{
        branch_code: this.gs.globalVariables.branch_code,
        company_code: this.gs.globalVariables.user_company_code,
        user_code: this.gs.globalVariables.user_code,
        page_count: 0,
        page_current: 0,
        page_rows: 20,
        page_rowcount: 0,
        searchstring: '',
        file_pkid: '',
        from_date: '',
        job_docno: '',
        list_agent_id: '',
        list_agent_name: '',
        list_exp_id: '',
        list_exp_name: '',
        list_imp_id: '',
        list_imp_name: '',
        list_buy_agent_id: '',
        list_buy_agent_name: '',
        list_pod_agent_id: '',
        list_pod_agent_name: '',
        ord_invoice: '',
        ord_po: '',
        report_folder: '',
        to_date: '',
        sort_colname: 'UID',
        sort_colvalue: 'a.ord_uid',
        ord_status: 'ALL',
        ord_showpending: 'N',
        ftp_transfertype: 'ORDERLIST',
        ftp_is_multipleorder: 'N',
        ftp_is_checklist: 'N',
        ftp_ordpoids: ''
      }
    };
 }
  LoadCombo() {
    this.SortList = [
      { "colheadername": "UID", "colname": "a.ord_uid" },
      { "colheadername": "CREATED-DATE", "colname": "a.rec_created_date" }
    ];
  }

  List(_type: string) {
    this.total = 0;
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: '',
      searchstring: this._record.searchQuery.searchstring,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this._record.searchQuery.page_count,
      page_current: this._record.searchQuery.page_current,
      page_rows: this._record.searchQuery.page_rows,
      page_rowcount: this._record.searchQuery.page_rowcount,
      job_docno: this._record.searchQuery.job_docno,
      ord_po: this._record.searchQuery.ord_po,
      ord_invoice: this._record.searchQuery.ord_invoice,
      from_date: this._record.searchQuery.from_date,
      to_date: this._record.searchQuery.to_date,
      list_exp_id: this._record.searchQuery.list_exp_id,
      list_imp_id: this._record.searchQuery.list_imp_id,
      list_agent_id: this._record.searchQuery.list_agent_id,
      list_buy_agent_id: this._record.searchQuery.list_buy_agent_id,
      list_pod_agent_id: this._record.searchQuery.list_pod_agent_id,
      ord_showpending: this._record.searchQuery.ord_showpending,
      report_folder: this.gs.globalVariables.report_folder,
      file_pkid: this.gs.getGuid(),
      ord_status: this._record.searchQuery.ord_status,
      sort_colname: this._record.searchQuery.sort_colvalue,
      ftp_transfertype: this._record.searchQuery.ftp_transfertype
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.OrdList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.record.records = response.list;
        this.record.searchQuery.page_count = response.page_count;
        this.record.searchQuery.page_current = response.page_current;
        this.record.searchQuery.page_rowcount = response.page_rowcount;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }



  OrdList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Joborderm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/Save', Record, this.gs.headerparam2('authorized'));
  }

  Upload(Record: JobOrder_VM) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/Upload', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  GenerateXmlEdiMexico(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Xml/XmlEdi/GenerateXmlEdiMexico', SearchData, this.gs.headerparam2('authorized'));
  }
  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }

}





