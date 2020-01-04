
import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm, SearchQuery } from '../../models/joborder';
import { Observable } from 'rxjs';
import { PageQuery } from 'src/app/shared/models/pageQuery';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';

import * as FromOrderActions from './store/orderlist.actions';
import * as FromOrderSelectors from './store/orderlist.selctor';

import { Location } from '@angular/common';


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
    private store: Store<AppState>
  ) {

    this.recordlist$ = this.store.select(FromOrderSelectors.SelectRecords);
    this.searchQuery$ = this.store.select(FromOrderSelectors.SelectSearchRecord);
    this.pageQuery$ = this.store.select(FromOrderSelectors.SelectPageQuery);
    this.errorMessage$ = this.store.select(FromOrderSelectors.SelectMessage);

    this.store.dispatch(FromOrderActions.RequestLoad());

  }
  // Init Will be called After executing Constructor
  ngOnInit() {

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

  ActionHandler(action: string, id: string) {
    /*
    if (!this.gs.canAdd(this.menuid)) {
      alert('Insufficient User Rights')
      return; 
    }
    */
    let parameter = {
      urlid: this.gs.getGuid(),
      menuid: this.gs.getParameter('menuid'),
      pkid: id,
      origin: 'orderlist',
      mode: action
    };
    this.gs.Naviagate2('clearing/orderedit', parameter);
  }

  Close() {
    this.location.back();
  }

}
