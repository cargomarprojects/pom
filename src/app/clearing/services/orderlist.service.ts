import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Joborderm, SearchQuery, JobOrderModel } from '../models/joborder';
import { GlobalService } from '../../core/services/global.service';
import { JobOrder_VM } from '../models/joborder';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class OrderListService {

  title = 'ORDER LIST';
  menuid: string = '';
  type: string = '';

  public initlialized = false;
  private appid = ''

  menu_record: any;
  total = 0;
  ErrorMessage = "";
  InfoMessage = "";
  loading = false;
  where_agent = "CUST_IS_AGENT = 'Y'";
  where_shipper = "CUST_IS_SHIPPER = 'Y'";
  where_consignee = "CUST_IS_CONSIGNEE = 'Y'";
  where_buy_agent = "CUST_IS_BUY_AGENT = 'Y'";
  modalRef: any;
  selectcheck: boolean = false;
  orderid = "";
  ord_trkids = "";
  ord_trkpos = "";
  trkdt_alldisplay = "N";

  SortList: any[];
  private _record: JobOrderModel;

  constructor(
    private modalService: NgbModal,
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

  ReadUserRights() {
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
  }

  initDefaultValues() {

    this.record = <JobOrderModel>{
      urlid: '',
      selectedId: '',
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


  public selectRowId(id: string) {
    this._record.selectedId = id;
  }
  public getRowId() {
    return this._record.selectedId;
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
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.trkdt_alldisplay = response.trkdt_alldisplay;
          this.record.records = response.list;
          this.record.searchQuery.page_count = response.page_count;
          this.record.searchQuery.page_current = response.page_current;
          this.record.searchQuery.page_rowcount = response.page_rowcount;
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  RefreshList(_rec: Joborderm) {
    if (this.record.records == null)
      return;
    var REC = this.record.records.find(rec => rec.ord_pkid == _rec.ord_pkid);
    if (REC == null) {
      this.record.records.push(_rec);
    }
    else {
      REC.ord_agent_name = _rec.ord_agent_name;
      REC.ord_agent_name = _rec.ord_agent_name;
      REC.ord_exp_name = _rec.ord_exp_name;
      REC.ord_imp_name = _rec.ord_imp_name;
      REC.ord_buy_agent_name = _rec.ord_buy_agent_name;
      REC.ord_pod_agent_name = _rec.ord_pod_agent_name;
      REC.ord_invno = _rec.ord_invno;
      REC.ord_po = _rec.ord_po;
      REC.ord_style = _rec.ord_style;
      REC.ord_color = _rec.ord_color;
      REC.ord_pkg = _rec.ord_pkg;
      REC.ord_pcs = _rec.ord_pcs;
      REC.ord_cbm = _rec.ord_cbm;
      REC.ord_pol = _rec.ord_pol;
      REC.ord_pod = _rec.ord_pod;
    }
  }

  ShowTracking(modalname: any) {
    this.total = 0;
    this.ord_trkids = "";
    this.ord_trkpos = "";
    for (let rec of this.record.records) {

      if (rec.ord_selected) {
        this.total++;
        if (this.ord_trkids != "")
          this.ord_trkids += ",";
        this.ord_trkids += rec.ord_pkid;

        if (this.ord_trkpos != "")
          this.ord_trkpos += ",";
        this.ord_trkpos += rec.ord_po;
      }
    }
    if (this.gs.isBlank(this.ord_trkids)) {
      alert('No Rows Selected');
      return;
    }
    this.modalRef = this.modalService.open(modalname, { centered: true, backdrop: 'static', keyboard: true });
  }

  ShowStatus(modalname: any) {
    this.total = 0;
    this.ord_trkids = "";
    this.ord_trkpos = "";
    for (let rec of this.record.records) {

      if (rec.ord_selected) {
        this.total++;
        if (this.ord_trkids != "")
          this.ord_trkids += ",";
        this.ord_trkids += rec.ord_pkid;

        if (this.ord_trkpos != "")
          this.ord_trkpos += ",";
        this.ord_trkpos += rec.ord_po;
      }
    }
    if (this.gs.isBlank(this.ord_trkids)) {
      alert('No Rows Selected');
      return;
    }
    this.modalRef = this.modalService.open(modalname, { centered: true, backdrop: 'static', keyboard: true });

  }

  ShowHistory(modalname: any) {

    this.orderid = "";
    for (let rec of this.record.records) {
      if (rec.ord_selected) {
        this.orderid = rec.ord_pkid;
      }
    }

    if (this.gs.isBlank(this.orderid)) {
      alert('No Rows Selected');
      return;
    }
    this.modalRef = this.modalService.open(modalname, { centered: true, backdrop: 'static', keyboard: true });
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





