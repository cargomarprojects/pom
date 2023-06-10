import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm, SearchQuery } from '../../models/joborder';
import { PageQuery } from 'src/app/shared/models/pageQuery';
import { OrderListService } from '../../services/orderlist.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


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
    private ms: OrderListService,
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

}
