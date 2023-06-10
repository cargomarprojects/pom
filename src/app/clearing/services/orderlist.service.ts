
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Joborderm, SearchQuery, JobOrderModel } from '../models/joborder';
import { GlobalService } from '../../core/services/global.service';
import { JobOrder_VM } from '../models/joborder';


@Injectable({ providedIn: 'root' })
export class OrderListService {

  ErrorMessage = "";
  InfoMessage = "";
  loading = false;
  where_agent = "CUST_IS_AGENT = 'Y'";
  where_shipper = "CUST_IS_SHIPPER = 'Y'";
  where_consignee = "CUST_IS_CONSIGNEE = 'Y'";
  where_buy_agent = "CUST_IS_BUY_AGENT = 'Y'";
  
  _record: JobOrderModel;

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {

      this.record =  {};
  }

  public get record() {
    return this._record;
  }

  public set record( value : any) {
    this._record = value;
  }

  List(_type: string, searchQuery: SearchQuery) {
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: '',
      searchstring: searchQuery.searchstring,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: searchQuery.page_count,
      page_current: searchQuery.page_current,
      page_rows: searchQuery.page_rows,
      page_rowcount: searchQuery.page_rowcount,
      job_docno: searchQuery.job_docno,
      ord_po: searchQuery.ord_po,
      ord_invoice: searchQuery.ord_invoice,
      from_date: searchQuery.from_date,
      to_date: searchQuery.to_date,
      list_exp_id: searchQuery.list_exp_id,
      list_imp_id: searchQuery.list_imp_id,
      list_agent_id: searchQuery.list_agent_id,
      list_buy_agent_id: searchQuery.list_buy_agent_id,
      list_pod_agent_id: searchQuery.list_pod_agent_id,
      ord_showpending: searchQuery.ord_showpending,
      report_folder: this.gs.globalVariables.report_folder,
      file_pkid: this.gs.getGuid(),
      ord_status: searchQuery.ord_status,
      sort_colname: searchQuery.sort_colvalue,
      ftp_transfertype: searchQuery.ftp_transfertype
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.OrdList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.record.records = response.list;
        searchQuery.page_count = response.page_count;
        searchQuery.page_current = response.page_current;
        searchQuery.page_rowcount = response.page_rowcount;
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





