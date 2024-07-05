import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Planm } from '../models/planm';
import { VslPlanService } from '../services/vslplan.service';
import { SearchTable } from '../../shared/models/searchtable';
import { DateComponent } from '../../shared/date/date.component';
import { Location } from '@angular/common';
import { Joborderm } from '../models/joborder';

@Component({
  selector: 'app-vslplan-edit',
  templateUrl: './vslplan-edit.component.html'
})
export class VslPlanEditComponent {

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() mode: string = '';
  @Input() pkid: string = '';



  InitCompleted: boolean = false;
  menu_record: any;
  title: '';

  bChanged: boolean;
  disableSave = true;
  loading = false;
  ord_selected = false;
  chkselected = false;
  ctrlDisable = false;
  ord_hblcntrselected = false;
  chkhblcntrselected = false;
  canHblCntrUpdate = false;

  bPrint: boolean = false;
  searchstring = '';
  public orderids = "";
  public ord_trkids = "";
  public ord_trkpos = "";
  public ord_imp_grp_id = "";
  public mblid = "";
  total = 0;
  total_hblcntr = 0;

  selectedId = "";
  trkdt_alldisplay = "N";

  modalRef: any;
  urlid: string;
  lock_record: boolean = false;
  errorMessage: string[] = [];
  Record: Planm = <Planm>{};

  constructor(
    private modalService: NgbModal,
    public ms: VslPlanService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {

    const data = this.route.snapshot.queryParams;
    if (data != null) {
      this.InitCompleted = true;
      this.menuid = data.menuid;
      this.type = data.type;
      this.mode = data.mode;
      this.pkid = data.pkid;
      this.InitComponent();
    }

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.ActionHandler();
  }
  InitComponent() {
    this.bPrint = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_print)
        this.bPrint = true;
    }
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  selectRowId(id: string) {
    this.selectedId = id;
  }
  getRowId() {
    return this.selectedId;
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "VESSEL") {
      this.Record.vp_vessel_id = _Record.id;
      this.Record.vp_vessel_code = _Record.code;
      this.Record.vp_vessel_name = _Record.name;
    }
    else if (_Record.controlname == "AGENT-POL") {
      this.Record.vp_pol_agent_id = _Record.id;
      this.Record.vp_pol_agent_code = _Record.code;
      this.Record.vp_pol_agent_name = _Record.name;
    }
    else if (_Record.controlname == "AGENT-POD") {
      this.Record.vp_pod_agent_id = _Record.id;
      this.Record.vp_pod_agent_code = _Record.code;
      this.Record.vp_pod_agent_name = _Record.name;
    }
    else if (_Record.controlname == "CONSIGNEE") {
      this.Record.vp_imp_id = _Record.id;
      this.Record.vp_imp_code = _Record.code;
      this.Record.vp_imp_name = _Record.name;
    }
    else if (_Record.controlname == "MASTER-NO") {
      this.Record.vp_mbl_id = _Record.id;
      this.Record.vp_mbl_no = _Record.code;
    }
    else if (_Record.controlname == "POL") {
      this.Record.vp_pol_id = _Record.id;
      this.Record.vp_pol_code = _Record.code;
      this.Record.vp_pol_name = _Record.name;
    }
    else if (_Record.controlname == "POD") {
      this.Record.vp_pod_id = _Record.id;
      this.Record.vp_pod_code = _Record.code;
      this.Record.vp_pod_name = _Record.name;
    }

  }

  ActionHandler() {
    this.errorMessage = [];
    if (this.mode === 'ADD') {
      this.resetControls();
      this.newRecord();
    }
    else if (this.mode === 'EDIT') {
      this.resetControls();
      this.getRecord(this.pkid);
    }
  }

  newRecord() {
    this.Record.vp_locked = false;
    this.ctrlDisable = false;
    this.chkselected = false;
    this.ord_selected = false;
    this.chkhblcntrselected = false;
    this.ord_hblcntrselected = false;
    this.pkid = this.gs.getGuid();
    this.Record = new Planm;
    this.Record.vp_pkid = this.pkid;
    this.Record.vp_plan_date = this.gs.defaultValues.today;
    this.Record.vp_week_no = 0;
    this.Record.vp_etd = '';
    this.Record.vp_vessel_id = '';
    this.Record.vp_vessel_code = '';
    this.Record.vp_vessel_name = '';
    this.Record.vp_voyage = '';
    this.Record.vp_status = 'IN PROGRESS';
    this.Record.vp_comments = '';
    this.Record.vp_pol_agent_id = '';
    this.Record.vp_pol_agent_code = '';
    this.Record.vp_pol_agent_name = '';
    this.Record.vp_pod_agent_id = '';
    this.Record.vp_pod_agent_code = '';
    this.Record.vp_pod_agent_name = '';
    this.Record.vp_imp_id = '';
    this.Record.vp_imp_code = '';
    this.Record.vp_imp_name = '';
    this.Record.vp_mbl_id = '';
    this.Record.vp_mbl_no = '';
    this.Record.vp_pol_id = '';
    this.Record.vp_pol_code = '';
    this.Record.vp_pol_name = '';
    this.Record.vp_pol_etd = '';
    this.Record.vp_pod_id = '';
    this.Record.vp_pod_code = '';
    this.Record.vp_pod_name = '';
    this.Record.vp_pod_eta = ''
    this.Record.rec_mode = this.mode;
    this.Record.rec_version = 0;

  }

  resetControls() {
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


  // Load a single Record for VIEW/EDIT
  getRecord(Id: string, _type: string = "") {
    this.loading = true;
    let SearchData = {
      pkid: Id,
      type: _type,
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code
    };
    this.errorMessage = [];
    this.ms.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.ctrlDisable = response.ctrldisable;
          this.trkdt_alldisplay = response.trkdt_alldisplay;
          this.LoadData(response.record);
        }
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
          this.mode = 'ADD';
          this.ActionHandler();
        });
  }

  LoadData(_Record: Planm) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    this.mblid = this.Record.vp_mbl_id;
    this.ord_selected = false;
    if (this.Record.OrderList.length > 0)
      this.ord_selected = true;
    this.chkselected = this.ord_selected;
    this.setCanUpdateHblCntr();
    this.FindCount();
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }
  // Save Data
  Save() {

    if (!this.allvalid())
      return;
    this.loading = true;
    this.errorMessage = [];
    this.Record.vp_type = 'PLANNING';
    this.Record.rec_category = this.type;
    this.Record._globalvariables = this.gs.globalVariables;
    this.ms.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.ctrlDisable = response.ctrldisable;
        if (this.mode == 'ADD') {
          this.Record.vp_plan_no = response.planno;
        }
        // this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.Record.rec_version = response.version;
        if (this.ctrlDisable && this.Record.vp_mbl_id.length > 0)
          this.Record.vp_locked = true;

        this.mblid = this.Record.vp_mbl_id;
        this.setCanUpdateHblCntr();
        this.ms.RefreshList(this.Record);
        this.gs.showToastScreen(['Save Complete']);
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.errorMessage = [];

    if (this.Record.vp_plan_date.trim().length <= 0) {
      bret = false;
      this.errorMessage.push("Date Cannot Be Blank");
    }
    // if (this.Record.vp_pol_agent_id.trim().length <= 0) {
    //   bret = false;
    //   this.errorMessage.push("Agent.pol Cannot Be Blank");
    // }
    // if (this.Record.vp_imp_id.trim().length <= 0) {
    //   bret = false;
    //  this.errorMessage.push("Consignee Cannot Be Blank");
    // }
    // if (this.Record.vp_pod_agent_id.trim().length <= 0) {
    //   bret = false;
    //   this.errorMessage.push("Agent.pod Cannot Be Blank");
    // }
    // if (this.Record.vp_week_no <= 0) {
    //   bret = false;
    //   this.errorMessage.push("Week Number Cannot Be Blank");
    // }

    if (bret === false) {
      this.gs.showToastScreen(this.errorMessage);
    }

    return bret;
  }

  OnChange(field: string) {
    if (field == 'ord_selected') {
      this.FindCount();
    }
    if (field == 'ord_hblcntrselected') {
      this.FindCount();
    }
  }


  OnBlur(field: string) {
    switch (field) {
      case 'vp_voyage':
        {
          this.Record.vp_voyage = this.Record.vp_voyage.toUpperCase();
          break;
        }
      case 'vp_comments':
        {
          this.Record.vp_comments = this.Record.vp_comments.toUpperCase();
          break;
        }
    }
  }

  FindCount() {
    this.total = 0; this.total_hblcntr = 0;
    for (let rec of this.Record.OrderList) {
      if (rec.ord_selected) {
        this.total++;
      }
      if (rec.ord_hblcntrselected) {
        this.total_hblcntr++;
      }
    }
  }

  OrderList() {

    this.errorMessage = [];
    // if (this.ord_po.trim().length <= 0) {
    //       this.gs.showToastScreen(["PO Cannot Be Blank"])
    //       return;
    // }

    this.loading = true;
    let SearchData = {
      rowtype: this.ms.type,
      planid: this.Record.vp_pkid,
      polagentid: this.Record.vp_pol_agent_id,
      podagentid: this.Record.vp_pod_agent_id,
      consigneeid: this.Record.vp_imp_id,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    this.errorMessage = [];
    this.ms.OrderList(SearchData)
      .subscribe(response => {
        this.loading = false;
        // var REC = null;
        //   for (let Rec of response.list) {
        //     REC = this.Record.OrderList.find(a => a.ord_pkid == Rec.ord_pkid);
        //     if (REC == null) {
        //       this.Record.OrderList.push(Rec);
        //     }
        //   }
        this.Record.OrderList = response.list;
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
        });

  }

  SelectDeselect() {
    this.total = 0;
    this.chkselected = !this.chkselected;
    for (let rec of this.Record.OrderList) {
      rec.ord_selected = this.chkselected;
      if (rec.ord_selected) {
        this.total++;
      }
    }
  }

  SelectDeselectHblCntr() {
    this.total_hblcntr = 0;
    this.chkhblcntrselected = !this.chkhblcntrselected;
    for (let rec of this.Record.OrderList) {
      rec.ord_hblcntrselected = this.chkhblcntrselected;
      if (rec.ord_hblcntrselected) {
        this.total_hblcntr++;
      }
    }
  }

  Close() {
    this.gs.ClosePage('home');
  }

  ShowTracking(modalname: any) {
    this.errorMessage = [];
    this.total = 0;
    this.ord_trkids = "";
    this.ord_trkpos = "";
    this.ord_imp_grp_id = "";
    let bMultplrGrpId = false;
    for (let rec of this.Record.OrderList) {

      if (rec.ord_selected) {

        if (this.total == 0)
          this.ord_imp_grp_id = rec.ord_imp_grp_id;

        this.total++;
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

    if (this.gs.isBlank(this.ord_trkids)) {
      this.gs.showToastScreen(['No Rows Selected']);
      return;
    }

    if (bMultplrGrpId) {
      this.gs.showToastScreen(['Invalid Consignee Group Selected']);
      return;
    }

    // this.modalRef = this.modalService.open(modalname, { centered: true, backdrop: 'static', keyboard: true });
    this.open(modalname);
  }

  CloseModal1(params: any) {
    if (params.saction == 'SAVE') {
      var arrPkid = params.sid.split(',');
      for (var i = 0; i < arrPkid.length; i++) {
        for (let rec of this.Record.OrderList.filter(rec => rec.ord_pkid == arrPkid[i])) {
          rec.ord_cargo_status = params.trackstatus;
          rec.ord_cargo_status_date = params.cargostatusdate;
          if (params.sdatetype == "BKD")
            rec.ord_booking_date = params.trackdate;
          else if (params.sdatetype == "RND")
            rec.ord_rnd_insp_date = params.trackdate;
          else if (params.sdatetype == "POR")
            rec.ord_po_rel_date = params.trackdate;
          else if (params.sdatetype == "CFS")
            rec.ord_cargo_ready_date = params.trackdate;
          else if (params.sdatetype == "FCR")
            rec.ord_fcr_date = params.trackdate;
          else if (params.sdatetype == "INSP")
            rec.ord_insp_date = params.trackdate;
          else if (params.sdatetype == "STUF")
            rec.ord_stuf_date = params.trackdate;
          else if (params.sdatetype == "WHD")
            rec.ord_whd_date = params.trackdate;
          else if (params.sdatetype == "SOB")
            rec.ord_dlv_pol_date = params.trackdate;
          else if (params.sdatetype == "DPOD")
            rec.ord_dlv_pod_date = params.trackdate;
        }
      }
    }
    this.modalRef.close();
  }
  CloseModal2(params: any) {
    if (params.saction == 'SAVE') {
      // this.OrderList();
      this.getRecord(this.pkid);
    }
    this.modalRef.close();
  }

  UpdateHouseContainer(_content: any) {
    if (this.gs.isBlank(this.mblid)) {
      this.gs.showToastScreen(['Invalid Master#']);
      return;
    }

    this.total_hblcntr = 0;
    this.orderids = "";
    this.ord_imp_grp_id = "";
    let bMultplrGrpId = false;
    let blankplanId = false;
    for (let rec of this.Record.OrderList) {
      if (rec.ord_hblcntrselected) {

        if (this.total_hblcntr == 0)
          this.ord_imp_grp_id = rec.ord_imp_grp_id;

        this.total_hblcntr++;
        if (this.orderids != "")
          this.orderids += ",";
        this.orderids += rec.ord_pkid;

        if (this.ord_imp_grp_id != rec.ord_imp_grp_id)
          bMultplrGrpId = true;
        if (this.gs.isBlank(rec.ord_plan_id))
          blankplanId = true;
      }
    }

    if (this.gs.isBlank(this.orderids)) {
      this.gs.showToastScreen(['No Rows Selected']);
      return;
    }

    if (bMultplrGrpId) {
      this.gs.showToastScreen(['Invalid Consignee Group Selected']);
      return;
    }

    if (blankplanId) {
      this.gs.showToastScreen(['Missing Data Found, Please save and continue.......']);
      return;
    }

    this.open(_content);
  }

  open(content: any) {
    this.modalRef = this.modalService.open(content, { centered: true, backdrop: 'static', keyboard: true });
  }

  setCanUpdateHblCntr() {
    this.canHblCntrUpdate = false;
    for (let rec of this.Record.OrderList) {
      if (!this.gs.isBlank(rec.ord_plan_id)) {
        this.canHblCntrUpdate = true;
        break;
      }
    }
  }

  ShowHideRecord(_rec: Joborderm) {
    if (!_rec.ord_mbl_no)
      return;
    if (!_rec.row_displayed) {
      this.OrderLinkList(_rec);
    }
    _rec.row_displayed = !_rec.row_displayed;
  }

  OrderLinkList(_rec: Joborderm) {
    this.errorMessage = [];
    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      orderid: _rec.ord_pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };
    this.ms.OrderLinkList(SearchData)
      .subscribe(response => {
        this.loading = false;
        _rec.LinkHblCntrList = response.list;
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
        });
  }

}
