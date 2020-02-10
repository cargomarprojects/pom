import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { SelectPkids, SelectRefNos } from '../orderlist/list/store/orderlist.selctors';
import { map, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { TrackOrderService } from '../services/trackorder.service';

import * as FromOrderActions from '../orderlist/list/store/orderlist.actions';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  providers : [TrackOrderService]
})
export class StatusComponent {
  // Local Variables 
  title = 'Track Details';

  @Output() ChangeStatus = new EventEmitter<any>();
  @Output() closeModalWindow = new EventEmitter<any>();


  private menuid: string = '';
  private type: string = '';
  pkid: string;
  refno: string = '';

  pkid$: Observable<string>;
  refno$: Observable<string>;


  ids : any [];

  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  mode = 'EDIT';
  ErrorMessage = "";
  InfoMessage = "";

  ord_status = 'APPROVED';

  constructor(
    private mainService: TrackOrderService,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private store: Store<AppState>,
    private location: Location,
  ) {

    //this.menuid = options.menuid;
    //this.type = options.type;

    this.pkid$ = this.store.pipe(
      select(SelectPkids),
      tap(x => {
        this.pkid = x;
      })
    );

    this.refno$ = this.store.pipe(
      select(SelectRefNos),
      tap(x => {
        this.refno = x;
      })
    );
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
  }

  InitComponent() {
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
  }

  save() {

    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.pkid.trim().length <= 0) {
      this.ErrorMessage = " Cannot Update Invalid ID";
      return;
    }

    let SearchData = {
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      pkids: this.pkid,
      status : this.ord_status,
      user_code : this.gs.globalVariables.user_code
    };

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.mainService.ChangeStatus(SearchData)
      .subscribe(response => {
        this.InfoMessage = "Save Complete";
        this.ids = response.list;
        var urlid = this.gs.getParameter('urlid');
        this.store.dispatch( FromOrderActions.ChangeStatus({urlid: urlid, pkids: this.ids})  )
        this.Close();
      }, error => {
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }

  Close() {
    this.closeModalWindow.emit();
  }


}
