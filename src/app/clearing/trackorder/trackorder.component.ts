import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Joborderm } from '../models/joborder';
import { Tracking_Caption } from '../models/tracking_caption';
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
  @Output() closeModalWindow = new EventEmitter<any>();

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


  disableSave0: boolean = true;
  disableSave1: boolean = true;
  disableSave2: boolean = true;
  disableSave3: boolean = true;
  disableSave4: boolean = true;
  disableSave5: boolean = true;
  disableSave6: boolean = true;
  disableSave7: boolean = true;
  disableSave8: boolean = true;
  disableSave9: boolean = true;

  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  mode = 'EDIT';
  ErrorMessage = "";
  InfoMessage = "";
  Record: Joborderm = <Joborderm>{};
  TrkCaptionList: Tracking_Caption[] = [];

  constructor(
    private mainService: TrackOrderService,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private store: Store<AppState>,
    private location: Location

  ) {
    //this.menuid = options.menuid;
    //this.type = options.type;

    this.pkid$ = this.store.pipe(
      select(SelectPkids),
      tap(x => {
        this.pkid = x;
        this.process();
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
    this.LoadCaptions();

  }

  LoadCaptions() {
    this.loading = true;
    let SearchData = {
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetTrackingCaptions(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.TrkCaptionList = response.list;

        for (var i = 0; i < this.TrkCaptionList.length; i++) {
          if (this.TrkCaptionList[i].trk_enabled) {
            this.EnableSave(i);
            break;
          }
        }
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });

  }

  process() {
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
    this.Record.ord_booking_date_enabled = true;
    this.Record.ord_rnd_insp_date_enabled = true;
    this.Record.ord_po_rel_date_enabled = true;
    this.Record.ord_cargo_ready_date_enabled = true;
    this.Record.ord_fcr_date_enabled = true;
    this.Record.ord_insp_date_enabled = true;
    this.Record.ord_stuf_date_enabled = true;
    this.Record.ord_whd_date_enabled = true;
    this.Record.ord_dlv_pol_date_enabled = true;
    this.Record.ord_dlv_pod_date_enabled = true;
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
        this.EnableSave(response.enableseq);
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
  // Update() {

  //   this.ErrorMessage = '';
  //   this.InfoMessage = '';
  //   if (this.Record.ord_pkid.trim().length <= 0) {
  //     this.ErrorMessage = " Cannot Save Invalid ID";
  //     alert(this.ErrorMessage);
  //     return;
  //   }

  //   this.loading = true;
  //   this.ErrorMessage = '';
  //   this.InfoMessage = '';
  //   this.Record._globalvariables = this.gs.globalVariables;
  //   this.mainService.Update(this.Record)
  //     .subscribe(response => {
  //       this.loading = false;
  //       // this.InfoMessage = "Save Complete";
  //       this.Close();
  //     },
  //       error => {
  //         this.loading = false;
  //         this.ErrorMessage = this.gs.getError(error);
  //         alert(this.ErrorMessage);
  //       });
  // }

  // Save Data
  Update(_seq: number) {

    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.Record.ord_pkid.trim().length <= 0) {
      this.ErrorMessage = " Cannot Save Invalid ID";
      alert(this.ErrorMessage);
      return;
    }

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.ord_trk_date_seq = _seq;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Update(this.Record)
      .subscribe(response => {
        this.loading = false;
        // this.InfoMessage = "Save Complete";
        // this.EnableSave(response.enableseq);
        this.Close();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
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

  EnableSave(_seq: number) {
    this.disableSave0 = true;
    this.disableSave1 = true;
    this.disableSave2 = true;
    this.disableSave3 = true;
    this.disableSave4 = true;
    this.disableSave5 = true;
    this.disableSave6 = true;
    this.disableSave7 = true;
    this.disableSave8 = true;
    this.disableSave9 = true;
    if (_seq == 0)
      this.disableSave0 = false;
    else if (_seq == 1)
      this.disableSave1 = false;
    else if (_seq == 2)
      this.disableSave2 = false;
    else if (_seq == 3)
      this.disableSave3 = false;
    else if (_seq == 4)
      this.disableSave4 = false;
    else if (_seq == 5)
      this.disableSave5 = false;
    else if (_seq == 6)
      this.disableSave6 = false;
    else if (_seq == 7)
      this.disableSave7 = false;
    else if (_seq == 8)
      this.disableSave8 = false;
    else if (_seq == 9)
      this.disableSave9 = false;
  }

}
