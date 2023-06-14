import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm } from '../../models/joborder';
import { OrderListService } from '../../services/orderlist.service';
import { SearchTable } from '../../../shared/models/searchtable';

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

  urlid: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  bAdmin = false;
  disableSave = true;
  loading = false;

  ErrorMessage = "";
  InfoMessage = "";
  Record: Joborderm = <Joborderm>{};

  constructor(
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
    this.pkid = this.gs.getGuid();
    this.Record.ord_pkid = this.pkid;
    this.Record.ord_status = 'REPORTED';
    this.Record.ord_agent_id = '';
    this.Record.ord_agent_code = '';
    this.Record.ord_agent_name = '';
    this.Record.ord_pod_agent_id = '';
    this.Record.ord_pod_agent_code = '';
    this.Record.ord_pod_agent_name = '';
    this.Record.ord_buy_agent_id = '';
    this.Record.ord_buy_agent_code = '';
    this.Record.ord_buy_agent_name = '';
    this.Record.ord_exp_id = '';
    this.Record.ord_exp_code = '';
    this.Record.ord_exp_name = '';
    this.Record.ord_imp_id = '';
    this.Record.ord_imp_code = '';
    this.Record.ord_imp_name = '';
    this.Record.ord_desc = '';
    this.Record.ord_cargo_status = '';
    this.Record.ord_po = '';
    this.Record.ord_style = '';
    this.Record.ord_color = '';
    this.Record.ord_pkg = 0;
    this.Record.ord_pcs = 0;
    this.Record.ord_ntwt = 0;
    this.Record.ord_grwt = 0;
    this.Record.ord_cbm = 0;
    this.Record.ord_boarding1 = '';
    this.Record.ord_boarding2 = '';
    this.Record.ord_instock1 = '';
    this.Record.ord_instock2 = '';
    this.Record.ord_cargo_readiness_date = ''
    this.Record.ord_booking_date_captn  = '';
    this.Record.ord_booking_date  = '';
    this.Record.ord_rnd_insp_date_captn = ''; 
    this.Record.ord_rnd_insp_date  = '';
    this.Record.ord_po_rel_date_captn  = '';
    this.Record.ord_po_rel_date  = '';
    this.Record.ord_cargo_ready_date_captn = ''; 
    this.Record.ord_cargo_ready_date  = '';
    this.Record.ord_fcr_date_captn  = '';
    this.Record.ord_fcr_date  = '';
    this.Record.ord_insp_date_captn = ''; 
    this.Record.ord_insp_date  = '';
    this.Record.ord_stuf_date_captn  = '';
    this.Record.ord_stuf_date  = '';
    this.Record.ord_whd_date_captn  = '';
    this.Record.ord_whd_date  = '';
    this.Record.ord_dlv_pol_date_captn = ''; 
    this.Record.ord_dlv_pol_date  = '';
    this.Record.ord_dlv_pod_date_captn  = '';
    this.Record.ord_dlv_pod_date  = '';
    this.Record.rec_mode = 'ADD';
    this.Record.rec_category = 'SEA EXPORT';

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

  loadData(_Record: Joborderm) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
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
      case 'ord_cargo_status':
        {
          this.Record.ord_cargo_status = this.Record.ord_cargo_status.toUpperCase();
          break;
        }
      case 'ord_desc':
        {
          this.Record.ord_desc = this.Record.ord_desc.toUpperCase();
          break;
        }
      case 'ord_cbm':
        {
          this.Record.ord_cbm = this.gs.roundWeight(this.Record.ord_cbm, "CBM");
          break;
        }
      case 'ord_pcs':
        {
          this.Record.ord_pcs = this.gs.roundWeight(this.Record.ord_pcs, "PCS");
          break;
        }
      case 'ord_pkg':
        {
          this.Record.ord_pkg = this.gs.roundWeight(this.Record.ord_pkg, "PKG");
          break;
        }
      case 'ord_grwt':
        {
          this.Record.ord_grwt = this.gs.roundWeight(this.Record.ord_grwt, "GRWT");
          break;
        }
      case 'ord_ntwt':
        {
          this.Record.ord_ntwt = this.gs.roundWeight(this.Record.ord_ntwt, "NTWT");
          break;
        }
      case 'ord_color':
        {
          //this.FindContractNo();
          break;
        }
    }
  }


  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "SHIPPER") {
      this.Record.ord_exp_id = _Record.id;
      this.Record.ord_exp_name = _Record.name;
      this.Record.ord_exp_code = _Record.code;
    }
    if (_Record.controlname == "CONSIGNEE") {
      this.Record.ord_imp_id = _Record.id;
      this.Record.ord_imp_name = _Record.name;
      this.Record.ord_imp_code = _Record.code;
    }
    if (_Record.controlname == "AGENT") {
      this.Record.ord_agent_id = _Record.id;
      this.Record.ord_agent_code = _Record.code;
      this.Record.ord_agent_name = _Record.name;
    }
    if (_Record.controlname == "BUY-AGENT") {
      this.Record.ord_buy_agent_id = _Record.id;
      this.Record.ord_buy_agent_code = _Record.code;
      this.Record.ord_buy_agent_name = _Record.name;
    }
    if (_Record.controlname == "POD-AGENT") {
      this.Record.ord_pod_agent_id = _Record.id;
      this.Record.ord_pod_agent_code = _Record.code;
      this.Record.ord_pod_agent_name = _Record.name;
    }
    if (_Record.controlname == "POL") {
      this.Record.ord_pol_id = _Record.id;
      this.Record.ord_pol = _Record.code;
    }
    else if (_Record.controlname == "POD") {
      this.Record.ord_pod_id = _Record.id;
      this.Record.ord_pod = _Record.code;
    }
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  FindContractNo() {
    let sContract: string = "";
    sContract = this.Record.ord_po;
    if (!this.gs.isBlank(this.Record.ord_style)) {
      if (sContract.trim() != "")
        sContract += "/";
      sContract += this.Record.ord_style;
    }
    if (!this.gs.isBlank(this.Record.ord_color)) {
      if (sContract.trim() != "")
        sContract += "-";
      sContract += this.Record.ord_color;
    }
    this.Record.ord_contractno = sContract.trim();

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
        if (this.mode == 'ADD') {
          this.Record.ord_uid = response.uidno;
          this.Record.ord_status_color = 'BLUE';
        }
        // this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.ms.RefreshList(this.Record);
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

    if (this.gs.isBlank(this.Record.ord_agent_id)) {
      bret = false;
      sError += " Agent(Origin) Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.ord_exp_id)) {
      bret = false;
      sError += "\n\r | Shipper Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.ord_imp_id)) {
      bret = false;
      sError += "\n\r | Consignee Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.ord_pod_agent_id)) {
      bret = false;
      sError += "\n\r | Agent(Destination) Cannot Be Blank";
    }

    if (this.gs.isBlank(this.Record.ord_po)) {
      bret = false;
      sError += "\n\r | PO Cannot Be Blank";
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

}
