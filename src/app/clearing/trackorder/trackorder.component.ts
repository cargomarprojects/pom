import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Joborderm } from '../models/joborder';
import { Tracking_Caption } from '../models/tracking_caption';
import { TrackOrderService } from '../services/trackorder.service';
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

  @Input() public ord_pkids: string = '';
  @Input() public ord_pos: string = '';
  @Input() public ord_imp_grp_id: string = '';
  @Input() public ord_header_id: string = '';

  private menuid: string = '';
  private type: string = '';
  pkid: string = '';
  refno: string = '';


  InitCompleted: boolean = false;
  menu_record: any;
  masterwise: boolean = false;

  enableDateCode: string = "";
  lastDateCode: string = "";

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
    private location: Location

  ) {
    //this.menuid = options.menuid;
    //this.type = options.type;  
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.gs.isBlank(this.ord_pkids)) {
      this.pkid = this.ord_pkids;
      this.masterwise = false;
      this.process();
    } else {
      if (!this.gs.isBlank(this.ord_header_id)) {
        this.pkid = this.ord_header_id;
        this.masterwise = true;
        this.process();
      }
    }
    this.LoadCaptions();
  }

  LoadCaptions() {
    /* this.loading = true;
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
       },
         error => {
           this.loading = false;
           this.ErrorMessage = this.gs.getError(error);
         });
 */
  }

  process() {
    this.NewRecord();
    if (this.pkid.length > 0) {
      this.GetRecord(this.pkid);
    }
  }


  NewRecord() {
    this.Record = <Joborderm>{};
    this.Record.ord_pkid = '';
    this.Record.ord_header_id = '';
    if (this.masterwise)
      this.Record.ord_header_id = this.pkid;
    else
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
      ord_imp_grp_id: this.ord_imp_grp_id,
      masterwise: this.masterwise
    };

    this.mode = "EDIT";
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.TrkCaptionList = response.list;
        this.enableDateCode = response.enablecode;
        this.lastDateCode = response.lastdatecode;
        if (response.error) {
          this.ErrorMessage = response.error;
          // alert(response.error); 
        }
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
  Update(_type: string) {

    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.masterwise) {
      if (this.Record.ord_header_id.trim().length <= 0) {
        this.ErrorMessage = " Cannot Save Invalid ID";
        alert(this.ErrorMessage);
        return;
      }
    } else {
      if (this.Record.ord_pkid.trim().length <= 0) {
        this.ErrorMessage = " Cannot Save Invalid ID";
        alert(this.ErrorMessage);
        return;
      }
    }

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.ord_trk_date_type = _type;
    this.Record.ord_imp_grp_id = this.ord_imp_grp_id;
    this.Record._globalvariables = this.gs.globalVariables;
    this.mainService.Update(this.Record)
      .subscribe(response => {
        this.loading = false;
        // this.InfoMessage = "Save Complete";

        this.closeModalWindow.emit({ saction: 'TRACK-SAVE', trackdate: response.trackdate, trackstatus: response.trackstatus, sdatetype: _type, sid: this.Record.ord_pkid, cargostatusdate: response.cargostatusdate });
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
    this.closeModalWindow.emit({ saction: 'CLOSE' });
  }

  IsDisableSave(_dateCode: string) {
    // if (_dateCode == this.enableDateCode || (this.gs.globalVariables.user_code == 'ADMIN' && this.enableDateCode))
    if (_dateCode == this.enableDateCode)
      return false;
    else
      return true;
  }

  GetCaptionName(_type: string) {
    var REC = this.TrkCaptionList.find(rec => rec.trk_caption_code == _type);
    if (REC != null)
      return REC.trk_caption_name;
    else
      return _type;
  }

  GetTrkEnabled(_type: string) {
    if (!this.gs.HideDisabledTrackingDate)
      return true;

    var REC = this.TrkCaptionList.find(rec => rec.trk_caption_code == _type);
    if (REC != null)
      return REC.trk_enabled;
    else
      return false;
  }
  EnableLastdate() {
    this.enableDateCode = this.lastDateCode;
  }
}
