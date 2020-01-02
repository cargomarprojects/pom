import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm, SearchQuery } from '../../models/joborder';
import { JobOrder_VM } from '../../models/joborder';
import { SearchTable } from '../../../shared/models/searchtable';
import { Observable } from 'rxjs';
import { PageQuery } from 'src/app/shared/models/pageQuery';
import { Store } from '@ngrx/store';
import { AppState, SelectRouterUrlId } from 'src/app/reducers';

import * as FromOrderReducer from './store/orderlist.reducer';
import * as FromOrderActions from './store/orderlist.actions';



@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html'
})
export class OrderListComponent {

  recordlist$: Observable<Joborderm[]>;
  pageQuery$: Observable<PageQuery>;
  searchQuery$: Observable<SearchQuery>;
  errorMessage$: Observable<string>;

  constructor(
    private gs: GlobalService,
    private store: Store<AppState>
  ) { }
  // Init Will be called After executing Constructor
  ngOnInit() {

    
    this.store.dispatch(FromOrderActions.RequestLoad());

    
    this.recordlist$ = this.store.select(FromOrderReducer.SelectRecords);
    this.searchQuery$ = this.store.select(FromOrderReducer.SelectSearchRecord);
    this.pageQuery$ = this.store.select(FromOrderReducer.SelectPageQuery);
    this.errorMessage$ = this.store.select(FromOrderReducer.SelectMessage);



  }

  //// Destroy Will be called when this component is closed
  ngOnDestroy() {
  }

  searchEvents(actions: any) {
    var urlid = this.gs.getParameter('urlid');
    this.store.dispatch(FromOrderActions.UpdateQuery({ id : urlid, stype: 'NEW', query: actions.searchQuery }));
  }

  pageEvents(actions: any) {
    var urlid = this.gs.getParameter('urlid');
    this.store.dispatch(FromOrderActions.UpdateQuery({ id : urlid, stype: actions.action , query: actions.pageQuery }));
  }

  ActionHandler(action : string , id : string ){

  }


}
