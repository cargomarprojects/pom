
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Planm, PlanModel, SearchQuery } from '../models/planm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class VslPlanService {

  title = 'VESSEL PLANNING';
  menuid: string = '';
  type: string = '';

  public initlialized = false;
  private appid = ''

  menu_record: any;
  modal: any;

  disableSave = true;
  loading = false;

  where_agent = "CUST_IS_AGENT = 'Y'";
  where_shipper = "CUST_IS_SHIPPER = 'Y'";
  where_consignee = "CUST_IS_CONSIGNEE = 'Y'";
  where_buy_agent = "CUST_IS_BUY_AGENT = 'Y'";
  searchstring = '';
  ErrorMessage = "";
  InfoMessage = "";

  private _record: PlanModel;

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }
  public get record() {
    return this._record;
  }
  public set record(value: any) {
    this._record = value;
  }

  public init(params: any) {

    if (this.appid != this.gs.globalVariables.appid) {
      this.appid = this.gs.globalVariables.appid;
      this.initlialized = false;
    }
    if (this.initlialized)
      return;

    this.menuid = params.menuid;

    this.type = params.type;

    this.initDefaultValues();

    this.LoadCombo();

    this.ReadUserRights();

    this.List("NEW");

    this.initlialized = true;
  }

  initDefaultValues() {
    this.record = <PlanModel>{
      urlid: '',
      selectedId: '',
      message: '',
      isError: false,
      records: [],
      searchQuery: <SearchQuery>{
        type: '',
        rowtype: this.type,
        searchstring: '',
        company_code: this.gs.globalVariables.comp_code,
        branch_code: this.gs.globalVariables.branch_code,
        year_code: this.gs.globalVariables.year_code,
        user_code: this.gs.globalVariables.user_code,
        page_count: 0,
        page_current: 0,
        page_rows: 20,
        page_rowcount: 0,
        pol_agent_id: '',
        imp_id: '',
        pod_agent_id: '',
        vessel_id: '',
        status: '',
        list_pol_agent_id: '',
        list_pol_agent_name: '',
        list_imp_id: '',
        list_imp_name: '',
        list_pod_agent_id: '',
        list_pod_agent_name: '',
        list_vessel_id: '',
        list_vessel_name: '',
        list_status: 'ALL'
      }
    };
  }
  ReadUserRights() {
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
  }

  public selectRowId(id: string) {
    this._record.selectedId = id;
  }
  public getRowId() {
    return this._record.selectedId;
  }

  LoadCombo() {

  }

  // Query List Data
  List(_type: string) {
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this._record.searchQuery.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
      year_code: this.gs.globalVariables.year_code,
      pol_agent_id: this._record.searchQuery.list_pol_agent_id,
      imp_id: this._record.searchQuery.list_imp_id,
      pod_agent_id: this._record.searchQuery.list_pod_agent_id,
      vessel_id: this._record.searchQuery.list_vessel_id,
      status: this._record.searchQuery.list_status,
      page_count: this._record.searchQuery.page_count,
      page_current: this._record.searchQuery.page_current,
      page_rows: this._record.searchQuery.page_rows,
      page_rowcount: this._record.searchQuery.page_rowcount
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.VslList(SearchData)
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


  RefreshList(_rec: Planm) {
    if (this.record.records == null)
      return;
    var REC = this.record.records.find(rec => rec.vp_pkid == _rec.vp_pkid);
    if (REC == null) {
      this.record.records.push(_rec);
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

