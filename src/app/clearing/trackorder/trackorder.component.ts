import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Joborderm } from '../models/joborder';
import { TrackOrderService } from '../services/trackorder.service';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { SelectPkids, SelectRefNos } from '../orderlist/list/store/orderlist.selctors';
import { map, tap } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-trackorder',
  templateUrl: './trackorder.component.html',
  providers: [TrackOrderService]
})
export class TrackOrderComponent {
  // Local Variables 
  title = 'Track Details';

  @Output() ModifiedRecords = new EventEmitter<any>();
  @Output() closeModalWindow= new EventEmitter<any>();
  
  /*
  @Input() menuid: string = '';
  @Input() public pkid: string;
  @Input() public type: string = '';
  @Input() public refno: string = '';
  */
  private menuid: string = '';
  private type: string = '';
  pkid: string;
  refno: string = '';

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
  Record: Joborderm = <Joborderm>{};

  constructor(
    private mainService: TrackOrderService,
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
        this.process();
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

  process(){
    this.NewRecord();
    if (this.pkid.length > 0) {
      if (this.pkid.indexOf(",") < 0)
        this.GetRecord(this.pkid);
    }
  }


  NewRecord() {
    this.Record = <Joborderm>{};
    this.Record.ord_pkid = this.pkid;
    this.Record.ord_booking_date = '';
    this.Record.ord_rnd_insp_date = '';
    this.Record.ord_po_rel_date = '';
    this.Record.ord_cargo_ready_date = '';
    this.Record.ord_fcr_date = '';
    this.Record.ord_insp_date = '';
    this.Record.ord_stuf_date = '';
    this.Record.ord_whd_date = '';
    this.Record.ord_track_status = '';
    this.Record.ord_dlv_pol_date = '';
    this.Record.ord_dlv_pod_date = '';
  }


  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }


  GetRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id,
    };

    this.mode = "EDIT";
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LoadData(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  LoadData(_Record: Joborderm) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
  }

  // Save Data
  Update() {

    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.Record.ord_pkid.trim().length <= 0) {
      this.ErrorMessage = " Cannot Save Invalid ID";
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Update(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    return bret;
  }


  OnBlur(field: string) {
    switch (field) {
      case 'ord_cargo_status':
        {
          this.Record.ord_cargo_status = this.Record.ord_cargo_status.toUpperCase();
          break;
        }
    }
  }
  
  SearchRecord(controlname: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';

    if (controlname == 'cost_folderno') {
      if (this.Record.ord_pkid.trim().length <= 0) {
        this.ErrorMessage = " Cannot Update Invalid ID";
        return;
      }
    }

    this.loading = true;
    let SearchData = {
      rowtype: this.type,
      table: 'updatejoborderm',
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      pkid: this.Record.ord_pkid,
      cargostatus: ''
    };
    if (controlname == 'updatejoborderm') {
      SearchData.rowtype = this.type;
      SearchData.table = 'updatejoborderm';
      SearchData.company_code = this.gs.globalVariables.comp_code;
      SearchData.branch_code = this.gs.globalVariables.branch_code;
      SearchData.year_code = this.gs.globalVariables.year_code;
      SearchData.pkid = this.Record.ord_pkid;
      SearchData.cargostatus = this.Record.ord_cargo_status;
    }

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.ErrorMessage = '';
        this.InfoMessage = "Successfully Updated";
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });

  }


  Close() {
    this.closeModalWindow.emit();
  }



}
