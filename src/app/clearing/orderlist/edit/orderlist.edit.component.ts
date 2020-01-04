import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm } from '../../models/joborder';
import { JobOrder_VM } from '../../models/joborder';
import { OrderListService } from '../../services/orderlist.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-orderlistedit',
  templateUrl: './orderlist.edit.component.html',
  providers: [OrderListService]
})
export class OrderListEditComponent {
  // Local Variables 
  title = 'Order List';


  urlid: string = '';
  menuid: string = '';

  InitCompleted: boolean = false;

  menu_record: any;

  modal: any;

  bAdmin = false;

  ErrorMessage = "";

  InfoMessage = "";

  mode = "";
  pkid = "";

  OrdColList: any[];

  Record: Joborderm = <Joborderm>{};

  where_agent = "CUST_IS_AGENT = 'Y'";
  where_shipper = "CUST_IS_SHIPPER = 'Y'";
  where_consignee = "CUST_IS_CONSIGNEE = 'Y'";



  constructor(
    private mainService: OrderListService,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    // URL Query Parameter 

    this.InitCompleted = true;

    this.menuid = this.gs.getParameter("menuid");

    this.InitComponent();

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
  }

  InitComponent() {
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
    this.LoadCombo();
  }

  //// Destroy Will be called when this component is closed
  ngOnDestroy() {

  }


  LovSelected(_Record: SearchTable) {
    // Company Settings

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


    if (_Record.controlname == "POL") {
      this.Record.ord_pol_id = _Record.id;
      if (_Record.code.length >= 5)
        this.Record.ord_pol = _Record.code.substr(2, 3);
      else
        this.Record.ord_pol = _Record.code;
    }
    else if (_Record.controlname == "POD") {
      this.Record.ord_pod_id = _Record.id;
      if (_Record.code.length >= 5)
        this.Record.ord_pod = _Record.code.substr(2, 3);
      else
        this.Record.ord_pod = _Record.code;
    }

  }

  LoadCombo() {

    let SearchData = {
      type: 'ORDER',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    SearchData.comp_code = this.gs.globalVariables.comp_code;
    SearchData.branch_code = this.gs.globalVariables.branch_code;

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.OrdColList = response.ordercolumns;
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });

  }

  ////function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (action === 'ADD') {
      this.mode = 'ADD';
      this.ResetControls();
      this.NewRecord();
    }
    else if (action === 'EDIT') {
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
      this.GetRecord(id);
    }
  }


  disableSave = false;
  searchstring = '';

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




  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = <Joborderm>{};
    this.Record.ord_pkid = this.pkid;
    this.Record.ord_exp_id = '';
    this.Record.ord_exp_name = '';
    this.Record.ord_imp_id = '';
    this.Record.ord_imp_name = '';
    this.Record.ord_invno = '';
    this.Record.ord_uneco = '';
    this.Record.ord_po = '';
    this.Record.ord_style = '';
    this.Record.ord_cbm = 0;
    this.Record.ord_pcs = 0;
    this.Record.ord_pkg = 0;
    this.Record.ord_grwt = 0;
    this.Record.ord_ntwt = 0;
    this.Record.ord_hs_code = '';
    this.Record.ord_cargo_status = '';
    this.Record.ord_desc = '';
    this.Record.ord_stylename = '';
    this.Record.ord_color = '';
    this.Record.ord_contractno = '';
    this.Record.ord_source = '';
    this.Record.ord_pol = '';
    this.Record.ord_pod = '';
    this.Record.ord_pol_id = '';
    this.Record.ord_pod_id = '';
    this.Record.ord_pol_code = '';
    this.Record.ord_pod_code = '';
    this.Record.rec_category = 'SEA EXPORT';
    this.Record.ord_exp_code = '';
    this.Record.ord_imp_code = '';
    this.Record.ord_agent_code = '';
    this.Record.rec_mode = this.mode;
    this.Record.rec_mode = this.mode;
  }




  //// Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    let SearchData = {
      pkid: Id,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.LoadData(response.record);
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  LoadData(_Record: Joborderm) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
  }


  //// Save Data
  Save() {

    if (!this.allvalid())
      return;

    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.Record._globalvariables = this.gs.globalVariables;

    this.mainService.Save(this.Record)
      .subscribe(response => {
        if (this.mode == 'ADD')
          this.Record.ord_uid = response.uidno;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (this.Record.ord_agent_id = '') {
      bret = false;
      sError += " Agent Cannot Be Blank";
    }
    if (this.Record.ord_exp_id = '') {
      bret = false;
      sError += "\n\r | Shipper Cannot Be Blank";
    }
    if (this.Record.ord_imp_id = '') {
      bret = false;
      sError += "\n\r | Consignee Cannot Be Blank";
    }


    if (this.Record.ord_po.trim().length <= 0) {
      bret = false;
      sError += "\n\r | PO Cannot Be Blank";
    }


    if (bret === false)
      this.ErrorMessage = sError;
    return bret;

  }

  RefreshList() {
    /*
    
          REC.ord_agent_name = this.Record.ord_agent_name;
          REC.ord_exp_name = this.Record.ord_exp_name;
          REC.ord_imp_name = this.Record.ord_imp_name;
          REC.ord_invno = this.Record.ord_invno;
          REC.ord_po = this.Record.ord_po;
          REC.ord_style = this.Record.ord_style;
          REC.ord_contractno = this.Record.ord_contractno;
          REC.ord_uneco = this.Record.ord_uneco;
          REC.ord_pkg = this.Record.ord_pkg;
          REC.ord_pcs = this.Record.ord_pcs;
          REC.ord_grwt = this.Record.ord_grwt;
          REC.ord_ntwt = this.Record.ord_ntwt;
          REC.ord_cbm = this.Record.ord_cbm;
          REC.ord_desc = this.Record.ord_desc;
          REC.ord_color = this.Record.ord_color;
          REC.ord_hs_code = this.Record.ord_hs_code;
          REC.ord_cargo_status = this.Record.ord_cargo_status;
          REC.rec_created_dte = this.Record.rec_created_dte;
          REC.ord_pol = this.Record.ord_pol;
          REC.ord_pod = this.Record.ord_pod;
          REC.ord_uid = this.Record.ord_uid;
      */

  }


  OnBlur(field: string) {
    switch (field) {
      case 'ord_exp_name':
        {
          this.Record.ord_exp_name = this.Record.ord_exp_name.toUpperCase();
          break;
        }
      case 'ord_imp_nmae':
        {
          this.Record.ord_imp_name = this.Record.ord_imp_name.toUpperCase();
          break;
        }
      case 'ord_invno':
        {
          this.Record.ord_invno = this.Record.ord_invno.toUpperCase();
          break;
        }
      case 'ord_uneco':
        {
          this.Record.ord_uneco = this.Record.ord_uneco.toUpperCase();
          break;
        }
      case 'ord_po':
        {
          this.Record.ord_po = this.Record.ord_po.toUpperCase();
          this.FindContractNo();
          break;
        }
      case 'ord_style':
        {
          this.Record.ord_style = this.Record.ord_style.toUpperCase();
          this.FindContractNo();
          break;
        }
      case 'ord_hs_code':
        {
          this.Record.ord_hs_code = this.Record.ord_hs_code.toUpperCase();
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
          this.Record.ord_color = this.Record.ord_color.toUpperCase();
          this.FindContractNo();
          break;
        }
      case 'ord_stylename':
        {
          this.Record.ord_stylename = this.Record.ord_stylename.toUpperCase();
          break;
        }
      case 'ord_contractno':
        {
          this.Record.ord_contractno = this.Record.ord_contractno.toUpperCase();
          break;
        }
      case 'ord_pol':
        {
          this.Record.ord_pol = this.Record.ord_pol.toUpperCase();
          break;
        }
      case 'ord_pod':
        {
          this.Record.ord_pod = this.Record.ord_pod.toUpperCase();
          break;
        }
    }
  }

  FindContractNo() {
    let sContract: string = "";
    sContract = this.Record.ord_po;
    if (this.Record.ord_style.trim() != "") {
      if (sContract.trim() != "")
        sContract += "/";
      sContract += this.Record.ord_style;
    }
    if (this.Record.ord_color.trim() != "") {
      if (sContract.trim() != "")
        sContract += "-";
      sContract += this.Record.ord_color;
    }
    this.Record.ord_contractno = sContract.trim();

  }




  Close() {
    this.gs.ClosePage('home', false);
  }




}
