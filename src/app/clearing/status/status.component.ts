import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { SelectPkids, SelectRefNos } from '../orderlist/list/store/orderlist.selctors';
import { map, tap } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html'
})
export class StatusComponent {
  // Local Variables 
  title = 'Track Details';

  @Output() ModifiedRecords = new EventEmitter<any>();
  
  @Output() closeModal= new EventEmitter<any>();

  private menuid: string = '';
  private type: string = '';
  private pkid: string;
  private refno: string = '';

  pkid$: Observable<string>;
  refno$: Observable<string>;

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
    private route: ActivatedRoute,
    private gs: GlobalService,
    private store : Store<AppState>,
    private location : Location

  ) {
    //this.menuid = options.menuid;
    //this.type = options.type;

    this.pkid$ = this.store.pipe(
      select( SelectPkids),
      tap ( x => {
        this.pkid = x;
      })
    );
    
    this.refno$ = this.store.pipe(
      select(SelectRefNos),
      tap ( x => {
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

  save(){
      this.Close();
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }

  Close() {
    this.closeModal.emit();
  }


}
