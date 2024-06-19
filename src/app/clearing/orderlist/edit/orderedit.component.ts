import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderh, Joborderm } from '../../models/joborder';
import { OrderListService } from '../../services/orderlist.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'App-OrderEdit',
  templateUrl: './orderedit.component.html'
})
export class OrderEditComponent {
  // Local Variables 
  title = 'Order List';
  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() mode: string = '';
  @Input() pkid: string = '';

  // @ViewChild('inv_no') private inv_no_ctrl: InputBoxComponent;


  urlid: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  bAdmin = false;
  disableSave = true;
  loading = false;
  modal: any;

  isPrevDetails: boolean = false;
  detailMode = "ADD";
  ErrorMessage = "";
  InfoMessage = "";
  Record: Joborderh = <Joborderh>{};
  Recorddet: Joborderm = new Joborderm;

  constructor(
    private modalService: NgbModal,
    public ms: OrderListService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    // URL Query Parameter 
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
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
  }

  ActionHandler() {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.mode === 'ADD') {
      this.resetControls();
      this.newRecord();
    }
    else if (this.mode === 'EDIT') {
      this.resetControls();
      this.getRecord(this.pkid);
    }
  }


  //// Destroy Will be called when this component is closed
  ngOnDestroy() {

  }


  newRecord() {
    this.ErrorMessage = '';
    this.pkid = this.gs.getGuid();
    this.Record = new Joborderh();
    this.Record.ordh_pkid = this.pkid;
    this.Record.ordh_exp_id = '';
    this.Record.ordh_exp_name = '';
    this.Record.ordh_imp_id = '';
    this.Record.ordh_imp_name = '';
    this.Record.ordh_exp_code = '';
    this.Record.ordh_imp_code = '';
    this.Record.ordh_agent_id = '';
    this.Record.ordh_agent_code = '';
    this.Record.ordh_agent_name = '';
    this.Record.ordh_pod_agent_id = '';
    this.Record.ordh_pod_agent_code = '';
    this.Record.ordh_pod_agent_name = '';
    this.Record.ordh_buy_agent_id = '';
    this.Record.ordh_buy_agent_code = '';
    this.Record.ordh_buy_agent_name = '';
    // this.Record.ordh_boarding1 = '';
    // this.Record.ordh_boarding2 = '';
    // this.Record.ordh_instock1 = '';
    // this.Record.ordh_instock2 = '';
    this.Record.ordh_pol = '';
    this.Record.ordh_pod = '';
    this.Record.ordh_pol_id = '';
    this.Record.ordh_pod_id = '';
    this.Record.ordh_pol_code = '';
    this.Record.ordh_pod_code = '';
    // this.Record.ordh_cargo_readiness_date = '';
    this.Record.ordh_detList = new Array<Joborderm>();
    this.Record.ordh_status = 'REPORTED';
    this.Record.ordh_date = this.gs.defaultValues.today;
    this.Record.ordh_remarks = '';
    this.Record.rec_mode = 'ADD';
    this.Record.rec_category = 'SEA EXPORT';
    // this.Record.ord_imp_grp_id  = '';
    this.NewDetRecord();
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
  getRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id,
      user_code: this.gs.globalVariables.user_code
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.ms.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.loadData(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
          this.mode = 'ADD';
          this.ActionHandler();
        });
  }

  loadData(_Record: Joborderh) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    this.NewDetRecord();
  }


  OnBlur(field: string) {
    switch (field) {
      case 'ord_po':
        {
          //this.FindContractNo();
          break;
        }
      case 'ord_style':
        {
          //this.FindContractNo();
          break;
        }
      case 'ordh_remarks':
        {
          this.Record.ordh_remarks = this.Record.ordh_remarks.toUpperCase();
          break;
        }
      case 'ord_desc':
        {
          this.Recorddet.ord_desc = this.Recorddet.ord_desc.toUpperCase();
          break;
        }

      // case 'ord_cbm':
      //   {
      //     this.Recorddet.ord_cbm = this.gs.roundWeight(this.Recorddet.ord_cbm, "CBM");
      //     break;
      //   }
      // case 'ord_pcs':
      //   {
      //     this.Recorddet.ord_pcs = this.gs.roundWeight(this.Recorddet.ord_pcs, "PCS");
      //     break;
      //   }
      // case 'ord_pkg':
      //   {
      //     this.Recorddet.ord_pkg = this.gs.roundWeight(this.Recorddet.ord_pkg, "PKG");
      //     break;
      //   }
      // case 'ord_grwt':
      //   {
      //     this.Recorddet.ord_grwt = this.gs.roundWeight(this.Recorddet.ord_grwt, "GRWT");
      //     break;
      //   }
      // case 'ord_ntwt':
      //   {
      //     this.Recorddet.ord_ntwt = this.gs.roundWeight(this.Recorddet.ord_ntwt, "NTWT");
      //     break;
      //   }
      case 'ord_color':
        {
          //this.FindContractNo();
          break;
        }
    }
  }


  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "SHIPPER") {
      this.Record.ordh_exp_id = _Record.id;
      this.Record.ordh_exp_name = _Record.name;
      this.Record.ordh_exp_code = _Record.code;
    }
    if (_Record.controlname == "CONSIGNEE") {
      this.Record.ordh_imp_id = _Record.id;
      this.Record.ordh_imp_name = _Record.name;
      this.Record.ordh_imp_code = _Record.code;
    }
    if (_Record.controlname == "AGENT") {
      this.Record.ordh_agent_id = _Record.id;
      this.Record.ordh_agent_code = _Record.code;
      this.Record.ordh_agent_name = _Record.name;
    }
    if (_Record.controlname == "BUY-AGENT") {
      this.Record.ordh_buy_agent_id = _Record.id;
      this.Record.ordh_buy_agent_code = _Record.code;
      this.Record.ordh_buy_agent_name = _Record.name;
    }
    if (_Record.controlname == "POD-AGENT") {
      this.Record.ordh_pod_agent_id = _Record.id;
      this.Record.ordh_pod_agent_code = _Record.code;
      this.Record.ordh_pod_agent_name = _Record.name;
    }
    if (_Record.controlname == "POL") {
      this.Record.ordh_pol_id = _Record.id;
      this.Record.ordh_pol_code = _Record.code;
      this.Record.ordh_pol = _Record.name;
    }
    else if (_Record.controlname == "POD") {
      this.Record.ordh_pod_id = _Record.id;
      this.Record.ordh_pod_code = _Record.code;
      this.Record.ordh_pod = _Record.name;
    }
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  FindContractNo() {
    let sContract: string = "";
    sContract = this.Recorddet.ord_po;
    if (!this.gs.isBlank(this.Recorddet.ord_style)) {
      if (sContract.trim() != "")
        sContract += "/";
      sContract += this.Recorddet.ord_style;
    }
    if (!this.gs.isBlank(this.Recorddet.ord_color)) {
      if (sContract.trim() != "")
        sContract += "-";
      sContract += this.Recorddet.ord_color;
    }
    this.Recorddet.ord_contractno = sContract.trim();

  }

  // Save Data
  Save() {

    if (!this.allvalid())
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;
    this.ms.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD')
          // if (this.mode == 'ADD') {
          //   this.Record.ord_uid = response.uidno;
          //   this.Record.ord_status_color = 'BLUE';
          //   this.Record.ord_imp_grp_id = response.grpid;
          // }
          // this.InfoMessage = "Save Complete";
          this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        for (let rec of response.list) {
          rec.ord_imp_grp_id = response.grpid;
          this.ms.RefreshList(rec);
        }
        alert('Save Complete');
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';


    if (this.gs.isBlank(this.Record.ordh_exp_id)) {
      bret = false;
      sError += "\n\r | Shipper Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.ordh_imp_id)) {
      bret = false;
      sError += "\n\r | Consignee Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.ordh_agent_id)) {
      bret = false;
      sError += " Agent(Origin) Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.ordh_pod_agent_id)) {
      bret = false;
      sError += "\n\r | Agent(Destination) Cannot Be Blank";
    }

    // if (this.gs.isBlank(this.Record.ord_po)) {
    //   bret = false;
    //   sError += "\n\r | PO Cannot Be Blank";
    // }
    if (this.Record.ordh_detList.length <= 0) {
      bret = false;
      sError += "\n\r | Order List Cannot Be Blank";
    }

    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }

    return bret;
  }


  Close() {
    this.gs.ClosePage('home', false);
  }

  AddRecord() {

    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (this.gs.isBlank(this.Recorddet.ord_invno)) {
      bret = false;
      sError += " | Invoice number cannot be blank";
    }

    if (this.gs.isBlank(this.Recorddet.ord_po)) {
      bret = false;
      sError += " | PO cannot be blank";
    }

    if (this.gs.isBlank(this.Recorddet.ord_desc)) {
      bret = false;
      sError += " | Description cannot be blank";
    }

    if (bret === false) {
      alert(sError);
      return;
    }

    if (this.detailMode == "ADD") {
      this.Record.ordh_detList.push(this.Recorddet);
    } else {
      var REC2 = this.Record.ordh_detList.find(rec => rec.ord_pkid == this.Recorddet.ord_pkid);
      if (REC2 != null) {
        REC2.ord_invno = this.Recorddet.ord_invno;
        REC2.ord_uneco = this.Recorddet.ord_uneco;
        REC2.ord_po = this.Recorddet.ord_po;
        REC2.ord_style = this.Recorddet.ord_style;
        REC2.ord_color = this.Recorddet.ord_color;
        REC2.ord_contractno = this.Recorddet.ord_contractno;
        REC2.ord_pkg = this.Recorddet.ord_pkg;
        REC2.ord_pcs = this.Recorddet.ord_pcs;
        REC2.ord_ntwt = this.Recorddet.ord_ntwt;
        REC2.ord_grwt = this.Recorddet.ord_grwt;
        REC2.ord_cbm = this.Recorddet.ord_cbm;
        REC2.ord_hs_code = this.Recorddet.ord_hs_code;
        REC2.ord_desc = this.Recorddet.ord_desc;
        REC2.ord_boarding1 = this.Recorddet.ord_boarding1;
        REC2.ord_boarding2 = this.Recorddet.ord_boarding2;
        REC2.ord_instock1 = this.Recorddet.ord_instock1;
        REC2.ord_instock2 = this.Recorddet.ord_instock2;
        REC2.ord_cargo_readiness_date = this.Recorddet.ord_cargo_readiness_date;
      }
    }
    this.isPrevDetails = true;
    this.NewDetRecord();
  }

  NewDetRecord() {
    this.detailMode = "ADD";
    let _preRecDet = this.Recorddet;
    this.Recorddet = new Joborderm();
    this.Recorddet.ord_pkid = this.gs.getGuid();;
    this.Recorddet.ord_header_id = this.pkid;
    this.Recorddet.ord_status = 'REPORTED';
    this.Recorddet.ord_desc = '';
    this.Recorddet.ord_cargo_status = '';
    this.Recorddet.ord_invno = '';
    this.Recorddet.ord_po = '';
    this.Recorddet.ord_contractno = '';
    this.Recorddet.ord_style = '';
    this.Recorddet.ord_color = '';
    this.Recorddet.ord_pkg = 0;
    this.Recorddet.ord_pcs = 0;
    this.Recorddet.ord_ntwt = 0;
    this.Recorddet.ord_grwt = 0;
    this.Recorddet.ord_cbm = 0;
    this.Recorddet.ord_hs_code = '';
    this.Recorddet.ord_uneco = '';
    this.Recorddet.ord_boarding1 = '';
    this.Recorddet.ord_boarding2 = '';
    this.Recorddet.ord_instock1 = '';
    this.Recorddet.ord_instock2 = '';
    this.Recorddet.ord_cargo_readiness_date = '';
    this.Recorddet.ord_booking_date_captn = '';
    this.Recorddet.ord_booking_date = '';
    this.Recorddet.ord_rnd_insp_date_captn = '';
    this.Recorddet.ord_rnd_insp_date = '';
    this.Recorddet.ord_po_rel_date_captn = '';
    this.Recorddet.ord_po_rel_date = '';
    this.Recorddet.ord_cargo_ready_date_captn = '';
    this.Recorddet.ord_cargo_ready_date = '';
    this.Recorddet.ord_fcr_date_captn = '';
    this.Recorddet.ord_fcr_date = '';
    this.Recorddet.ord_insp_date_captn = '';
    this.Recorddet.ord_insp_date = '';
    this.Recorddet.ord_stuf_date_captn = '';
    this.Recorddet.ord_stuf_date = '';
    this.Recorddet.ord_whd_date_captn = '';
    this.Recorddet.ord_whd_date = '';
    this.Recorddet.ord_dlv_pol_date_captn = '';
    this.Recorddet.ord_dlv_pol_date = '';
    this.Recorddet.ord_dlv_pod_date_captn = '';
    this.Recorddet.ord_dlv_pod_date = '';
    this.Recorddet.rec_mode = this.detailMode;
    this.Recorddet.rec_category = 'SEA EXPORT';
    this.Recorddet.ord_imp_grp_id = '';

    if (this.isPrevDetails) {
      this.Recorddet.ord_invno = _preRecDet.ord_invno;
      this.Recorddet.ord_uneco = _preRecDet.ord_uneco;
      this.Recorddet.ord_color = _preRecDet.ord_color;
      this.Recorddet.ord_style = _preRecDet.ord_style;
      this.Recorddet.ord_contractno = _preRecDet.ord_contractno;
      this.Recorddet.ord_desc = _preRecDet.ord_desc;
      this.Recorddet.ord_boarding1 = _preRecDet.ord_boarding1;
      this.Recorddet.ord_boarding2 = _preRecDet.ord_boarding2;
      this.Recorddet.ord_instock1 = _preRecDet.ord_instock1;
      this.Recorddet.ord_instock2 = _preRecDet.ord_instock2;
      this.Recorddet.ord_cargo_readiness_date = _preRecDet.ord_cargo_readiness_date;
    }
  }


  EditRecord(_rec: Joborderm) {
    this.detailMode = "EDIT";
    this.Recorddet = new Joborderm();
    this.Recorddet.ord_pkid = _rec.ord_pkid;
    this.Recorddet.ord_header_id = this.pkid;
    this.Recorddet.ord_invno = _rec.ord_invno;
    this.Recorddet.ord_uneco = _rec.ord_uneco;
    this.Recorddet.ord_po = _rec.ord_po;
    this.Recorddet.ord_style = _rec.ord_style;
    this.Recorddet.ord_color = _rec.ord_color;
    this.Recorddet.ord_contractno = _rec.ord_contractno;
    this.Recorddet.ord_pkg = _rec.ord_pkg;
    this.Recorddet.ord_pcs = _rec.ord_pcs;
    this.Recorddet.ord_ntwt = _rec.ord_ntwt;
    this.Recorddet.ord_grwt = _rec.ord_grwt;
    this.Recorddet.ord_cbm = _rec.ord_cbm;
    this.Recorddet.ord_hs_code = _rec.ord_hs_code;
    this.Recorddet.ord_desc = _rec.ord_desc;
    this.Recorddet.ord_boarding1 = _rec.ord_boarding1;
    this.Recorddet.ord_boarding2 = _rec.ord_boarding2;
    this.Recorddet.ord_instock1 = _rec.ord_instock1;
    this.Recorddet.ord_instock2 = _rec.ord_instock2;
    this.Recorddet.ord_cargo_readiness_date = _rec.ord_cargo_readiness_date;
  }

  DeleteRow(_rec: Joborderm) {

    if (!confirm("Delete selected row")) {
      return;
    }
    this.loading = true;
    let SearchData = {
      pkid: _rec.ord_pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.ms.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.retvalue == false) {
          this.ErrorMessage = response.error;
          alert(this.ErrorMessage);
        }
        else {
          this.Record.ordh_detList.splice(this.Record.ordh_detList.findIndex(rec => rec.ord_pkid == _rec.ord_pkid), 1);
          if (!this.gs.isBlank(this.ms.record.records))
            this.ms.record.records.splice(this.ms.record.records.findIndex(rec => rec.ord_pkid == _rec.ord_pkid), 1);
        }

      }, error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });
  }

  CloseModal1(params: any) {
    this.modal.close();
  }

  ShowTracking(modalname: any) {
    this.modal = this.modalService.open(modalname, { centered: true, backdrop: 'static', keyboard: true });
  }
}
