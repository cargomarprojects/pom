import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Joborderm, SearchQuery } from '../../models/joborder';
import { JobOrder_VM } from '../../models/joborder';
import { OrderListService } from '../../services/orderlist.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { Observable } from 'rxjs';
import { PageQuery } from 'src/app/shared/models/pageQuery';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';

import * as FromOrderReducer from './store/orderlist.reducer';
import * as FromOrderActions from './store/orderlist.actions';
import { map } from 'rxjs/operators';
import { resolve } from 'url';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  providers: [OrderListService]
})
export class OrderListComponent {
  
  data$: Observable<Joborderm[]>;
  pageQuery$: Observable< PageQuery >;
  searchQuery$: Observable<SearchQuery>;
  errorMessage$: Observable<string>;

  test : SearchQuery;

  constructor(
    private mainService: OrderListService,
    private gs: GlobalService,
    private store : Store<AppState>
  ) {}
    // Init Will be called After executing Constructor
  ngOnInit() {

    this.data$ = this.store.select(FromOrderReducer.SelectRecords);
    this.pageQuery$ = this.store.select(FromOrderReducer.SelectPageQuery );
    this.searchQuery$ = this.store.select(FromOrderReducer.SelectSearchRecord);
    this.errorMessage$ = this.store.select(FromOrderReducer.SelectMessage);

    this.store.dispatch( FromOrderActions.RequestLoad());

  }

  //// Destroy Will be called when this component is closed
  ngOnDestroy() {
  }

  searchEvents(actions: any) {
      //this.store.dispatch(new FromOrderActions.RequestLoad());
  }

  pageEvents(actions: any) {
    //this.store.dispatch(new fromparamactions.LoadParamRequest({ type: "PAGE", Query: actions.pageQuery }))
  }


}
