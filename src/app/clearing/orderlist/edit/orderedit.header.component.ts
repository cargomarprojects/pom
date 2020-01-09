import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm, JobOrderModel } from '../../models/joborder';
import { JobOrder_VM } from '../../models/joborder';
import { OrderListService } from '../../services/orderlist.service';
import { SearchTable } from '../../../shared/models/searchtable';

import { AutoComplete2Component } from 'src/app/shared/autocomplete2/autocomplete2.component';


@Component({
  selector: 'App-OrderEditHeader',
  templateUrl: './orderedit.header.component.html',
})
export class OrderEditHeaderComponent {
  // Local Variables 
  title = 'Order Details';


  @ViewChild('agentlov', { static: false }) inputbox_agentlov: AutoComplete2Component;

  Record: Joborderm = <Joborderm>{};
  @Input() set _record(value: Joborderm) {
    this.Record = { ...value };
  }

  @Output() save = new EventEmitter<Joborderm>();

  where_agent = "CUST_IS_AGENT = 'Y'";
  where_shipper = "CUST_IS_SHIPPER = 'Y'";
  where_consignee = "CUST_IS_CONSIGNEE = 'Y'";


  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService
  ) { }

  ngOnInit() {
    
  }

  ngOnDestroy() {
  }

  Save() {
    if (!this.allvalid())
      return;
    this.save.emit(this.Record);
  }


  ngAfterViewInit () {
    this.setInitialFocus();
  }

  setInitialFocus() {
    
      this.inputbox_agentlov.setfocus();

  }


  allvalid() {
    let sError: string = "";
    let bret: boolean = true;

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


    if (bret === false) {
      alert(sError);
    }
    return bret;
  }


  OnBlur(field: string) {
    switch (field) {
      case 'ord_po':
        {
          this.FindContractNo();
          break;
        }
      case 'ord_style':
        {
          this.FindContractNo();
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
          this.FindContractNo();
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

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
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
