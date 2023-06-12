import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { Joborderm, SearchQuery } from '../../models/joborder';
import { OrderListService } from '../../services/orderlist.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SearchTable } from 'src/app/shared/models/searchtable';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html'
})
export class OrderListComponent {

  constructor(
    public ms: OrderListService,
    public gs: GlobalService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
  ) {

    this.ms.record.searchQuery.page_count = 0;
    this.ms.record.searchQuery.page_rows = 20;
    this.ms.record.searchQuery.page_current = 0;
    const data = this.route.snapshot.queryParams;
    if (data != null) {
      this.ms.InitCompleted = true;
      this.ms.menuid = data.menuid;
      this.ms.type = data.type;
      this.ms.InitComponent();
    }

  }
  // Init Will be called After executing Constructor
  ngOnInit() {
    this.ms.LoadCombo();
  }

  //// Destroy Will be called when this component is closed
  ngOnDestroy() {
  }

  ActionHandler(action: string, id: string) {
    this.ms.ErrorMessage = '';
    this.ms.InfoMessage = '';
    if (action == "ADD" && !this.ms.menu_record.rights_add) {
      alert('Insufficient User Rights')
      return;
    }
    if (action == "EDIT" && !this.ms.menu_record.rights_edit) {
      alert('Insufficient User Rights')
      return;
    }

    var urlid = this.gs.getParameter('urlid');
    let parameter = {
      urlid: this.gs.getGuid(),
      parenturlid: urlid,
      menuid: this.gs.getParameter('menuid'),
      pkid: id,
      origin: 'orderlist',
      mode: action
    };

    this.router.navigate(['clearing/orderedit'], { queryParams: parameter });

  }

  Close() {
    this.location.back();
  }

  handleChange(rec: Joborderm) {
    if (rec.ord_selected)
      this.ms.total++;
    else
      this.ms.total--;
  }

  SelectCheckbox(flag: boolean) {
    this.ms.total = 0;
    for (let rec of this.ms.record.records) {
      rec.ord_selected = flag;
      if (rec.ord_selected) {
        this.ms.total++;
      }
    }
  }


  LovSelected(_Record: SearchTable) {
    // Company Settings
    if (_Record.controlname == "AGENT") {
      this.ms.record.searchQuery.list_agent_id = _Record.id;
      this.ms.record.searchQuery.list_agent_name = _Record.name;
    }
    if (_Record.controlname == "SHIPPER") {
      this.ms.record.searchQuery.list_exp_id = _Record.id;
      this.ms.record.searchQuery.list_exp_name = _Record.name;
    }
    if (_Record.controlname == "CONSIGNEE") {
      this.ms.record.searchQuery.list_imp_id = _Record.id;
      this.ms.record.searchQuery.list_imp_name = _Record.name;
    }
    if (_Record.controlname == "BUY-AGENT") {
      this.ms.record.searchQuery.list_buy_agent_id = _Record.id;
      this.ms.record.searchQuery.list_buy_agent_name = _Record.name;
    }
    if (_Record.controlname == "AGENT-POD") {
      this.ms.record.searchQuery.list_pod_agent_id = _Record.id;
      this.ms.record.searchQuery.list_pod_agent_name = _Record.name;
    }
  }


  CloseModal1(params: any) {
    if (params.saction == 'TRACK-SAVE') {
      var arrPkid = params.sid.split(',');
      for (var i = 0; i < arrPkid.length; i++) {
        for (let rec of this.ms.record.records.filter(rec => rec.ord_pkid == arrPkid[i])) {
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
    } else if (params.saction == 'STATUS-SAVE') {
      for (let rec1 of params.result) {
        for (let rec of this.ms.record.records.filter(rec => rec.ord_pkid == rec1.id)) {
          rec.ord_status = rec1.status;
          rec.ord_status_color = rec1.color;
        }
      }
    }
    this.ms.modalRef.close();
  }

}
