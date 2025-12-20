import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Joborderh, Joborderm, SearchQuery, JobOrderModel } from '../models/joborder';
import { GlobalService } from '../../core/services/global.service';
import { JobOrder_VM } from '../models/joborder';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserHistory } from 'src/app/shared/models/userhistory';
import { Tracking_Caption } from '../models/tracking_caption';

@Injectable({ providedIn: 'root' })
export class OrderListService {

  title = 'ORDER LIST';
  menuid: string = '';
  type: string = '';

  public initlialized = false;
  private appid = ''
  public canDelete: boolean;
  public bDocs: boolean = false;
  public bTrack: boolean = false;
  public bStatus: boolean = false;
  public bPrint: boolean = false;
  menu_record: any;
  total = 0;
  // ErrorMessage = "";
  // InfoMessage = "";
  public errorMessage: string[] = [];
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
  ord_imp_grp_id = "";
  trkdt_alldisplay = "N";
  ord_trkheaderid = "";
  public ord_list_type: string = "SUMMARY";

  public SortList: any[];
  public HistoryFilterList: any[];
  private _record: JobOrderModel;
  public trkRec: Joborderm = <Joborderm>{};
  public trkEventList: UserHistory[] = [];
  
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
    this.canDelete = false;
    this.bDocs = false;
    this.bTrack = false;
    this.bStatus = false;
    this.bPrint = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_delete)
        this.canDelete = true;
      if (this.menu_record.rights_docs)
        this.bDocs = true;
      if (this.menu_record.rights_print)
        this.bPrint = true;
      if (this.menu_record.rights_approval.indexOf('{TRACK}') >= 0 || this.gs.globalVariables.user_code == 'ADMIN')
        this.bTrack = true;
      if (this.menu_record.rights_approval.indexOf('{STATUS}') >= 0 || this.gs.globalVariables.user_code == 'ADMIN')
        this.bStatus = true;
    }
  }

  initDefaultValues() {
    this.total = 0;
    this.trkdt_alldisplay = "N";
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
        ord_cfno: '',
        vp_plan_no: '',
        ord_po: '',
        report_folder: '',
        to_date: '',
        sort_colname: 'CREATED-DATE',
        sort_colvalue: 'a.rec_created_date',
        ord_status: 'ALL',
        ord_showpending: 'N',
        ftp_transfertype: 'ORDERLIST',
        ftp_is_multipleorder: 'N',
        ftp_is_checklist: 'N',
        ftp_ordpoids: '',
        list_hide: false,
        list_orderwise: false,
        list_hidetrkevent: false
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
      { "colheadername": "CF#", "colname": "ordh_cfno" },
      { "colheadername": "UID", "colname": "a.ord_uid" },
      { "colheadername": "CREATED-DATE", "colname": "a.rec_created_date" }
    ];

    this.HistoryFilterList = [{ "id": "NA", "name": "NA" }, { "id": "EVENT", "name": "EVENT" }, { "id": "PO STATUS", "name": "PO STATUS" }];
  }

  List(_type: string) {
    this.total = 0;

    this.trkRec = new Joborderm();
    this.trkEventList = new Array<UserHistory>();
    this.record.records = new Array<Joborderm>();

    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: '',
      searchstring: this._record.searchQuery.searchstring,
      company_code: this.gs.globalVariables.comp_code,
      company_pkid: this.gs.globalVariables.comp_pkid,
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
      ord_cfno: this._record.searchQuery.ord_cfno,
      vp_plan_no: this._record.searchQuery.vp_plan_no,
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
      ftp_transfertype: this._record.searchQuery.ftp_transfertype,
      hide: this._record.searchQuery.list_hide,
      orderwise: this._record.searchQuery.list_orderwise
    };

    this.ord_list_type = "SUMMARY";
    if (this._record.searchQuery.list_orderwise)
      this.ord_list_type = "DETAILS"

    this.errorMessage = [];
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
          if (this.ord_list_type == "DETAILS") {
            if (!this.gs.isBlank(this.record.records))
              if (this.record.records.length > 0)
                this.ShowTrackingEvents(this.record.records[0], this.record.searchQuery.list_hidetrkevent);
          }
        }
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
        });
  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  RefreshList(_record: Joborderh) {
    if (this.record.records == null)
      return;

    if (this.ord_list_type == "SUMMARY") {
      for (let _rec of _record.ordh_detList) {
        var REC = this.record.records.find(rec => rec.ord_header_id == _rec.ord_header_id);
        if (REC == null) {
          _rec.ord_date = this.gs.defaultValues.today;
          _rec.ord_cfno = _record.ordh_cfno;
          _rec.ord_po_nos = _record.ordh_po_nos;
          this.record.records.push(_rec);
        }
        else {
          REC.ord_agent_name = _rec.ord_agent_name;
          REC.ord_agent_name = _rec.ord_agent_name;
          REC.ord_exp_name = _rec.ord_exp_name;
          REC.ord_imp_name = _rec.ord_imp_name;
          REC.ord_buy_agent_name = _rec.ord_buy_agent_name;
          REC.ord_pod_agent_name = _rec.ord_pod_agent_name;
          REC.ord_pol = _rec.ord_pol;
          REC.ord_pod = _rec.ord_pod;
          REC.ord_po_nos = _record.ordh_po_nos;
        }
        break;
      }
    } else {
      for (let _rec of _record.ordh_detList) {
        var REC = this.record.records.find(rec => rec.ord_pkid == _rec.ord_pkid);
        if (REC == null) {
          _rec.ord_date = this.gs.defaultValues.today;
          _rec.ord_cfno = _record.ordh_cfno;
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

    }
  }

  ShowTracking(modalname: any) {
    this.errorMessage = [];
    this.total = 0;
    this.ord_trkids = "";
    this.ord_trkpos = "";
    this.ord_imp_grp_id = "";
    this.ord_trkheaderid = "";
    let bMultplrGrpId = false;

    for (let rec of this.record.records) {

      if (rec.ord_selected) {

        if (this.total == 0)
          this.ord_imp_grp_id = rec.ord_imp_grp_id;

        this.total++;

        if (this.ord_list_type == "SUMMARY") {
          this.ord_trkheaderid = rec.ord_header_id;
        } else {

          if (this.ord_trkids != "")
            this.ord_trkids += ",";
          this.ord_trkids += rec.ord_pkid;

          if (this.ord_trkpos != "")
            this.ord_trkpos += ",";
          this.ord_trkpos += rec.ord_po;

          if (this.ord_imp_grp_id != rec.ord_imp_grp_id)
            bMultplrGrpId = true;
        }

      }
    }
    if (this.ord_list_type == "SUMMARY") {
      if (this.gs.isBlank(this.ord_trkheaderid)) {
        this.gs.showToastScreen(['No Rows Selected']);
        return;
      }
      if (this.total > 1) {
        this.gs.showToastScreen(['Please select one record and continue.....']);
        return;
      }

    } else {
      if (this.gs.isBlank(this.ord_trkids)) {
        this.gs.showToastScreen(['No Rows Selected']);
        return;
      }
      if (bMultplrGrpId) {
        this.gs.showToastScreen(['Invalid Consignee Group Selected']);
        return;
      }
    }

    this.modalRef = this.modalService.open(modalname, { centered: true, backdrop: 'static', keyboard: true });
  }

  ShowStatus(modalname: any) {
    this.errorMessage = [];
    this.total = 0;
    this.ord_trkids = "";
    this.ord_trkpos = "";
    this.ord_trkheaderid = "";
    for (let rec of this.record.records) {

      if (rec.ord_selected) {
        this.total++;
        if (this.ord_list_type == "SUMMARY") {
          this.ord_trkheaderid = rec.ord_header_id;
        } else {

          if (this.ord_trkids != "")
            this.ord_trkids += ",";
          this.ord_trkids += rec.ord_pkid;

          if (this.ord_trkpos != "")
            this.ord_trkpos += ",";
          this.ord_trkpos += rec.ord_po;
        }
      }
    }

    if (this.ord_list_type == "SUMMARY") {
      if (this.gs.isBlank(this.ord_trkheaderid)) {
        this.gs.showToastScreen(['No Rows Selected']);
        return;
      }
      if (this.total > 1) {
        this.gs.showToastScreen(['Please select one record and continue.....']);
        return;
      }

    } else {
      if (this.gs.isBlank(this.ord_trkids)) {
        this.errorMessage.push('No Rows Selected');
        return;
      }
    }
    this.modalRef = this.modalService.open(modalname, { centered: true, backdrop: 'static', keyboard: true });

  }

  ShowHistory(modalname: any) {
    this.errorMessage = [];
    this.total = 0;
    this.ord_trkids = "";
    this.ord_trkheaderid = "";
    for (let rec of this.record.records) {
      if (rec.ord_selected) {
        if (this.ord_list_type == "SUMMARY") {
          this.ord_trkheaderid = rec.ord_header_id;
        } else {
          this.ord_trkids = rec.ord_pkid;
          this.ord_trkheaderid = rec.ord_header_id;
        }
        this.total++;
      }
    }

    if (this.gs.isBlank(this.ord_trkheaderid)) {
      this.gs.showToastScreen(['No Rows Selected']);
      return;
    }
    if (this.total > 1) {
      this.gs.showToastScreen(['Please select one record and continue.....']);
      return;
    }
    this.modalRef = this.modalService.open(modalname, { centered: true, backdrop: 'static', keyboard: true });
  }

  DeleteRow(_rec: Joborderm, _type: string) {

    if (!confirm("DELETE ROW")) {
      return;
    }
    this.loading = true;
    let SearchData = {
      pkid: _type == "SUMMARY" ? _rec.ord_header_id : _rec.ord_pkid,
      type: _type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
      ord_header_id: _rec.ord_header_id
    };
    this.errorMessage = [];
    this.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.retvalue == false) {
          this.errorMessage = this.gs.getErrorArray(response.error);
          this.gs.showToastScreen(this.errorMessage);
        }
        else {
          if (_type == "SUMMARY")
            this.record.records.splice(this.record.records.findIndex(rec => rec.ord_header_id == _rec.ord_header_id), 1);
          else
            this.record.records.splice(this.record.records.findIndex(rec => rec.ord_pkid == _rec.ord_pkid), 1);
        }

      }, error => {
        this.loading = false;
        this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
        this.gs.showToastScreen(this.errorMessage);
      });
  }

  public ShowTrackingEvents(_trkRec: Joborderm, _hideTrkEvent: boolean) {

    if (_hideTrkEvent)
      return;

    this.trkRec = _trkRec;
    this.OrderLinkedList(_trkRec);

    this.loading = true;
    let SearchData = {
      table: 'userhistory',
      type: 'NEW',
      pkid: '',
      subid: _trkRec.ord_pkid,
      rowtype: this.type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      page_count: 0,
      page_current: 0,
      page_rows: 100,
      page_rowcount: 0,
      history_type: 'EVENT'
    };
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.trkEventList = response.list;
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
        });
  }

  OrderLinkedList(_rec: Joborderm) {
    this.errorMessage = [];
    let SearchData = {
      rowtype: _rec.rec_category,
      orderid: _rec.ord_pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };
    this.OrderLinkList(SearchData)
      .subscribe(response => {
        _rec.LinkHblCntrList = response.list;
      },
        error => {
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
        });

  }

  OrdList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Joborderh) {
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

  OrderLinkList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/VslPlan/OrderLinkList', SearchData, this.gs.headerparam2('authorized'));
  }
}





