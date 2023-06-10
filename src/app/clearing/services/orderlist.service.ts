
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Joborderm,SearchQuery,JobOrderModel } from '../models/joborder';
import { GlobalService } from '../../core/services/global.service';
import { JobOrder_VM } from '../models/joborder';


@Injectable({providedIn:'root'})
export class OrderListService {
 
  ErrorMessage = "";
  InfoMessage = "";
  loading = false;
  searchQuery: SearchQuery;
  record: JobOrderModel;

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }


  List(_type: string) {
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: '',
      searchstring: this.searchQuery.searchstring,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.searchQuery.page_count,
      page_current: this.searchQuery.page_current,
      page_rows: this.searchQuery.page_rows,
      page_rowcount: this.searchQuery.page_rowcount,
      job_docno: this.searchQuery.job_docno,
      ord_po: this.searchQuery.ord_po,
      ord_invoice: this.searchQuery.ord_invoice,
      from_date: this.searchQuery.from_date,
      to_date: this.searchQuery.to_date,
      list_exp_id: this.searchQuery.list_exp_id,
      list_imp_id: this.searchQuery.list_imp_id,
      list_agent_id: this.searchQuery.list_agent_id,
      list_buy_agent_id: this.searchQuery.list_buy_agent_id,
      list_pod_agent_id: this.searchQuery.list_pod_agent_id,
      ord_showpending: this.searchQuery.ord_showpending,
      report_folder: this.gs.globalVariables.report_folder,
      file_pkid: this.gs.getGuid(),
      ord_status: this.searchQuery.ord_status,
      sort_colname: this.searchQuery.sort_colvalue,
      ftp_transfertype:this.searchQuery.ftp_transfertype
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.OrdList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.record.records = response.list;
        this.searchQuery.page_count = response.page_count;
        this.searchQuery.page_current = response.page_current;
        this.searchQuery.page_rowcount = response.page_rowcount;
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





