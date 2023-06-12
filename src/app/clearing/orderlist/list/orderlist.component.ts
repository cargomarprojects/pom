import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { Joborderm, SearchQuery } from '../../models/joborder';
import { PageQuery } from 'src/app/shared/models/pageQuery';
import { OrderListService } from '../../services/orderlist.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SearchTable } from 'src/app/shared/models/searchtable';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent {

  urlid = '';
  menuid = '';
  constructor(
    public ms: OrderListService,
    private gs: GlobalService,
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

  ActionHandler(actions: any) {
    /*
    if (!this.gs.canAdd(this.menuid)) {
      alert('Insufficient User Rights')
      return; 
    }
    */
    var urlid = this.gs.getParameter('urlid');


    let parameter = {
      urlid: this.gs.getGuid(),
      parenturlid: urlid,
      menuid: this.gs.getParameter('menuid'),
      pkid: actions.id,
      origin: 'orderlist',
      mode: actions

    };

    this.router.navigate(['clearing/orderedit'], { queryParams: parameter });

  }

  Close() {
    this.location.back();
  }
  GetCaptionCode(_type: string) {
    var REC = this.gs.trkCaptionList.find(rec => rec.trk_caption_code == _type);
    if (REC != null) {
      if (REC.trk_enabled)
        return REC.trk_caption_code;
      else
        return '';
    }
    else
      return '';
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

  ShowHistory(modalname: any) {
    // if (this.total <= 0) {
    //   alert('No Rows Selected');
    //   return;
    // }

    // this.orderID$.subscribe ( id =>{
    //   console.log(id);
    //   this.orderid = id;
    //   this.modalRef = this.modalService.open(modalname, { centered: true, backdrop: 'static', keyboard: true });
    // });


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

  ShowTracking(modalname: any) {
    // if (this.total <= 0) {
    //   alert('No Rows Selected');
    //   return;
    // }
    // this.modalRef = this.modalService.open(modalname, { centered: true, backdrop: 'static', keyboard: true  });
    /*
        var urlid = this.gs.getParameter('urlid');
        let parameter = {
          urlid: urlid,
          type: '',
          origin: 'orderlist',
        };
        this.router.navigate(['clearing/tracking'], { queryParams: parameter });
    */

  }

}
