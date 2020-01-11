
import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm, SearchQuery } from '../../models/joborder';
import { Observable } from 'rxjs';
import { PageQuery } from 'src/app/shared/models/pageQuery';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';

import * as FromOrderActions from './store/orderlist.actions';
import * as FromOrderSelectors from './store/orderlist.selctors';

import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html'
})
export class OrderListComponent {

  urlid = '';
  menuid = '';

  recordlist$: Observable<Joborderm[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;
  errorMessage$: Observable<string>;


  

  constructor(
    private gs: GlobalService,
    private location: Location,
    private router : Router,
    private store: Store<AppState>
  ) {

    this.recordlist$ = this.store.pipe(select(FromOrderSelectors.SelectRecords));
    this.searchQuery$ = this.store.pipe(select(FromOrderSelectors.SelectSearchRecord));
    this.pageQuery$ = this.store.pipe(select(FromOrderSelectors.SelectPageQuery));
    this.errorMessage$ = this.store.pipe(select(FromOrderSelectors.SelectMessage));

    
    
    
  }
  // Init Will be called After executing Constructor
  ngOnInit() {

    this.store.dispatch(FromOrderActions.RequestLoad());    
    
  }

  //// Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  searchEvents(actions: any) {
    var urlid = this.gs.getParameter('urlid');
    this.store.dispatch(FromOrderActions.UpdateQuery({ urlid: urlid, stype: 'NEW', query: actions.searchQuery }));
  }

  pageEvents(actions: any) {
    var urlid = this.gs.getParameter('urlid');
    this.store.dispatch(FromOrderActions.UpdateQuery({ urlid: urlid, stype: actions.action, query: actions.pageQuery }));
  }

  ActionHandler(actions : any) {
    /*
    if (!this.gs.canAdd(this.menuid)) {
      alert('Insufficient User Rights')
      return; 
    }
    */
    var urlid = this.gs.getParameter('urlid');
    

    let parameter = {
      urlid: this.gs.getGuid(),
      parenturlid : urlid,
      menuid: this.gs.getParameter('menuid'),
      pkid: actions.id,
      origin: 'orderlist',
      mode: actions.action
    };

    this.router.navigate(['clearing/orderedit'], { queryParams: parameter});

  }

  Close() {
    this.location.back();
  }

}
