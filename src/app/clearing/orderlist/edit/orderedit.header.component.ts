import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm, JobOrderModel } from '../../models/joborder';
import { JobOrder_VM } from '../../models/joborder';
import { OrderListService } from '../../services/orderlist.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'App-OrderEditHeader',
  templateUrl: './orderedit.header.component.html',
  providers: [OrderListService]
})
export class OrderEditHeaderComponent {
  // Local Variables 
  title = 'Order Details';
  urlid: string = '';
  menuid: string = '';
  disableSave = false;
  searchstring = '';
  InitCompleted: boolean = false;
  menu_record: any;
  bAdmin = false;
  ErrorMessage = "";
  InfoMessage = "";
  mode = "";
  pkid = "";
  OrdColList: any[];

  Record: Joborderm = <Joborderm>{};
  @Input() set _record(value: Joborderm) {
    
    this.Record = {...value};
    
    //this.Record = Object.assign({}, value);
  }

  @Output() save = new EventEmitter<Joborderm>();

  where_agent = "CUST_IS_AGENT = 'Y'";
  where_shipper = "CUST_IS_SHIPPER = 'Y'";
  where_consignee = "CUST_IS_CONSIGNEE = 'Y'";


  constructor(
    private mainService: OrderListService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.InitCompleted = true;
    this.urlid = this.gs.getParameter("urlid");
    this.menuid = this.gs.getParameter("menuid");
    this.mode = this.gs.getParameter("mode");

    this.InitComponent();
  }

  ngOnInit() {

  }

  ngOnDestroy() {
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

  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (action === 'ADD') {
      this.mode = 'ADD';
      this.ResetControls();
      this.NewRecord();
    }
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


  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  NewRecord() {

    this.pkid = this.gs.getGuid();
    this.Record = <Joborderm>{};
    this.Record.ord_pkid = this.pkid;

    this.Record.ord_exp_id = '';
    this.Record.ord_exp_code = '';
    this.Record.ord_exp_name = '';

    this.Record.ord_imp_id = '';
    this.Record.ord_imp_code = '';
    this.Record.ord_imp_name = '';

    this.Record.ord_agent_id = '';
    this.Record.ord_agent_code = '';
    this.Record.ord_agent_name = '';

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

    this.Record.rec_mode = this.mode;
  }

  Save() {
    if (!this.allvalid())
      return;
    
    this.Record._globalvariables = this.gs.globalVariables;
    const data = {...this.Record, _globalvariables : this.gs.globalVariables};

    this.save.emit(this.Record);

  }



  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (this.gs.isBlank(this.Record.ord_agent_id)) {
      bret = false;
      sError += " Agent Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.ord_exp_id)) {
      bret = false;
      sError += "\n\r | Shipper Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.ord_imp_id)) {
      bret = false;
      sError += "\n\r | Consignee Cannot Be Blank";
    }

    if (this.gs.isBlank(this.Record.ord_po)) {
      bret = false;
      sError += "\n\r | PO Cannot Be Blank";
    }


    if (bret === false)
      this.ErrorMessage = sError;
    return bret;

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

  InitComponent() {
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
    //this.LoadCombo();
  }


}
