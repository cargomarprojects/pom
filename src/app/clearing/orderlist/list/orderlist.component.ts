import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm, SearchQuery } from '../../models/joborder';
import { PageQuery } from 'src/app/shared/models/pageQuery';
import { OrderListService } from '../../services/orderlist.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SearchTable } from 'src/app/shared/models/searchtable';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent {

  urlid = '';
  menuid = '';
  query: SearchQuery;
  pageQuery:  PageQuery;

  constructor(
    public ms: OrderListService,
    private gs: GlobalService,
    private location: Location,
    private router: Router,
  ) {

    

  }
  // Init Will be called After executing Constructor
  ngOnInit() {
    
     
  }

  //// Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  // searchEvents(actions: any) {
  //   var urlid = this.gs.getParameter('urlid');

  //   // if (actions.outputformat == 'MAIL-FTP') {
  //   if (actions.outputformat == 'EXCEL') {
  //     this.store.dispatch(FromOrderActions.UpdateQuery({ urlid: urlid, stype: 'EXCEL', query: actions.searchQuery }));
  //   } 
  //   else
  //     this.store.dispatch(FromOrderActions.UpdateQuery({ urlid: urlid, stype: 'NEW', query: actions.searchQuery }));
  // }

  pageEvents(actions: any) {
    // var urlid = this.gs.getParameter('urlid');
    // this.store.dispatch(FromOrderActions.UpdateQuery({ urlid: urlid, stype: actions.action, query: actions.pageQuery }));
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
    var urlid = this.gs.getParameter('urlid');
    // this.store.dispatch(SelectDeselctRecord({ urlid: urlid, pkid: rec.ord_pkid, ball: false, flag: rec.ord_selected }));
  }

  ShowHistory(modalname :any) {
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
      this.query.list_agent_id = _Record.id;
      this.query.list_agent_name = _Record.name;
    }
    if (_Record.controlname == "SHIPPER") {
      this.query.list_exp_id = _Record.id;
      this.query.list_exp_name = _Record.name;
    }
    if (_Record.controlname == "CONSIGNEE") {
      this.query.list_imp_id = _Record.id;
      this.query.list_imp_name = _Record.name;
    }
    if (_Record.controlname == "BUY-AGENT") {
      this.query.list_buy_agent_id = _Record.id;
      this.query.list_buy_agent_name = _Record.name;
    }        
    if (_Record.controlname == "AGENT-POD") {
      this.query.list_pod_agent_id = _Record.id;
      this.query.list_pod_agent_name = _Record.name;
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
