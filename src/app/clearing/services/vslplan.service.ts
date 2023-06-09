
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Planm } from '../models/planm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class VslPlanService {

  title = 'VESSEL PLANNING';
  menuid: string = '';
  type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

  modal: any;

  disableSave = true;
  loading = false;

  searchstring = '';

  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;
  urlid: string;

  ErrorMessage = "";
  InfoMessage = "";

  mode = '';
  pkid = '';
  where_agent = "CUST_IS_AGENT = 'Y'";
  where_shipper = "CUST_IS_SHIPPER = 'Y'";
  where_consignee = "CUST_IS_CONSIGNEE = 'Y'";
  where_buy_agent = "CUST_IS_BUY_AGENT = 'Y'";

  list_pol_agent_id = '';
  list_pol_agent_name = '';
  list_imp_id = '';
  list_imp_name = '';
  list_pod_agent_id = '';
  list_pod_agent_name = '';
  list_vessel_id = '';
  list_vessel_name = '';
  list_status = 'ALL';
  // Array For Displaying List
  RecordList: Planm[] = [];
  // Single Record for add/edit/view details
  Record: Planm = new Planm;

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }


  InitComponent() {
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.List("NEW");
  }


  ResetControls() {
    this.disableSave = true;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;
    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;
    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;

    return this.disableSave;
  }

  // Query List Data
  List(_type: string) {
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
      year_code: this.gs.globalVariables.year_code,
      pol_agent_id: this.list_pol_agent_id,
      imp_id: this.list_imp_id,
      pod_agent_id: this.list_pod_agent_id,
      vessel_id: this.list_vessel_id,
      status: this.list_status,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.VslList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  RefreshList(_rec:Planm) {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.vp_pkid == _rec.vp_pkid);
    if (REC == null) {
      this.RecordList.push(_rec);
    }
    else {
      REC.vp_plan_date = _rec.vp_plan_date;
      REC.vp_pol_agent_name = _rec.vp_pol_agent_name;
      REC.vp_pod_agent_name = _rec.vp_pod_agent_name;
      REC.vp_week_no = _rec.vp_week_no;
      REC.vp_etd = _rec.vp_etd;
      REC.vp_vessel_name = _rec.vp_vessel_name;
      REC.vp_voyage = _rec.vp_voyage;
      REC.vp_status = _rec.vp_status;
      REC.vp_comments = _rec.vp_comments;
    }
  }

  

  VslList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/VslPlan/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/VslPlan/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Planm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/VslPlan/Save', Record, this.gs.headerparam2('authorized'));
  }

  OrderList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/VslPlan/OrderList', SearchData, this.gs.headerparam2('authorized'));
  }

}

