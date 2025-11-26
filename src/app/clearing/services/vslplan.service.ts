
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Planm, PlanModel, SearchQuery } from '../models/planm';
import { GlobalService } from '../../core/services/global.service';

@Injectable({ providedIn: 'root' })
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
  public bAdmin = false;
  public bTrack = false;
  public bUpdateHouse = false;
  public bUnlock = false;

  where_agent = "CUST_IS_AGENT = 'Y'";
  where_shipper = "CUST_IS_SHIPPER = 'Y'";
  where_consignee = "CUST_IS_CONSIGNEE = 'Y'";
  where_buy_agent = "CUST_IS_BUY_AGENT = 'Y'";
  searchstring = '';
  // ErrorMessage = "";
  // InfoMessage = "";
  show_hide_caption = "HIDE";
  public errorMessage: string[] = [];

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

    if (this.appid != this.gs.globalVariables.appid || this.menuid != params.menuid) {
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
        list_status: 'ALL',
        list_hide: false
      }
    };
  }
  ReadUserRights() {
    this.bAdmin = false;
    this.bTrack = false;
    this.bUpdateHouse = false;
    this.bUnlock = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_approval.indexOf('{TRACK}') >= 0 || this.gs.globalVariables.user_code == 'ADMIN')
        this.bTrack = true;
      if (this.menu_record.rights_approval.indexOf('{UPDHOUSE}') >= 0 || this.gs.globalVariables.user_code == 'ADMIN')
        this.bUpdateHouse = true;
      if (this.menu_record.rights_approval.indexOf('{UNLOCK}') >= 0 || this.gs.globalVariables.user_code == 'ADMIN')
        this.bUnlock = true;
    }
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

    this.show_hide_caption = this._record.searchQuery.list_hide ? "SHOW" : "HIDE";
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
      hide: this._record.searchQuery.list_hide,
      page_count: this._record.searchQuery.page_count,
      page_current: this._record.searchQuery.page_current,
      page_rows: this._record.searchQuery.page_rows,
      page_rowcount: this._record.searchQuery.page_rowcount
    };

    this.errorMessage = [];
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
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage)
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
      REC.vp_plan_date = this.gs.getDateddMMMyyyy(_rec.vp_plan_date);
      REC.vp_pol_agent_name = _rec.vp_pol_agent_name;
      REC.vp_pod_agent_name = _rec.vp_pod_agent_name;
      REC.vp_week_no = _rec.vp_week_no;
      REC.vp_etd = this.gs.getDateddMMMyyyy(_rec.vp_etd);
      REC.vp_vessel_name = _rec.vp_vessel_name;
      REC.vp_voyage = _rec.vp_voyage;
      REC.vp_status = _rec.vp_status;
      REC.vp_comments = _rec.vp_comments;
      REC.vp_mbl_no = _rec.vp_mbl_no;
      REC.vp_pol_name = _rec.vp_pol_name;
      REC.vp_pol_etd = this.gs.getDateddMMMyyyy(_rec.vp_pol_etd);
      REC.vp_pod_name = _rec.vp_pod_name;
      REC.vp_pod_eta = this.gs.getDateddMMMyyyy(_rec.vp_pod_eta);
    }
  }

  ChangeShowHide(_rec: Planm) {

    let msg = "";
    this.errorMessage = [];
    if (_rec.vp_pkid.trim().length <= 0) {
      this.gs.showToastScreen(["Invalid Record"])
      return;
    }

    msg = _rec.vp_hide == "Y" ? "Show CF# " + _rec.vp_plan_no.toString() : "Hide CF# " + _rec.vp_plan_no.toString();
    if (!confirm(msg)) {
      return;
    }

    this.loading = true;
    let SearchData = {
      pkid: _rec.vp_pkid,
      hide: _rec.vp_hide,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code
    };
    this.errorMessage = [];
    this.HideRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.record.records.splice(this.record.records.findIndex(rec => rec.vp_pkid == _rec.vp_pkid), 1);
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
        });

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

  HideRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/VslPlan/HideRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  OrderLinkList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/VslPlan/OrderLinkList', SearchData, this.gs.headerparam2('authorized'));
  }
}

