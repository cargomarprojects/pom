import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../../../core/services/global.service';
import { Trackingm } from '../../../../models/tracking';
import { SearchTable } from '../../../../../shared/models/searchtable';
import { Param } from '../../../../../master/models/param';

@Component({
  selector: 'app-transit',
  templateUrl: './transit.component.html',
})
export class TransitComponent {
  // Local Variables 
  title = 'Transit Details';
  @Output() ModifiedRecords = new EventEmitter<any>();
  @Input() menuid: string = '';
  @Input() public pkid: string = '';
  @Input() public type: string = '';
  @Input() mRecord: Trackingm = new Trackingm;
  @Input() statuslist: Param[] = [];

  InitCompleted: boolean = false;
  menu_record: any;

  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  // PODRECORD: SearchTable = new SearchTable();
  ErrorMessage = "";
  InfoMessage = "";
  constructor(
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {

    // URL Query Parameter 
    this.sub = this.route.queryParams.subscribe(params => {
      if (params["parameter"] != "") {
        this.InitCompleted = true;
        var options = JSON.parse(params["parameter"]);
        this.menuid = options.menuid;
        this.type = options.type;
        this.InitComponent();
      }
    });

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
    this.LoadCombo();
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  LoadCombo() {

  }

 
  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "POL") {
      this.mRecord.trk_pol_id = _Record.id;
      this.mRecord.trk_pol_code = _Record.code;
      this.mRecord.trk_pol_name = _Record.name;
    }

    if (_Record.controlname == "VESSEL") {
      this.mRecord.trk_vsl_id = _Record.id;
      this.mRecord.trk_vsl_code = _Record.code;
      this.mRecord.trk_vsl_name = _Record.name;
    }
  }

  AddRow() {
    if (this.ModifiedRecords != null)
      this.ModifiedRecords.emit({ saction: 'ADD', type: 'TRANSIT', sid: this.mRecord.trk_pkid });
  }

  RemoveRow() {
    if (this.ModifiedRecords != null)
      this.ModifiedRecords.emit({ saction: 'REMOVE', type: 'TRANSIT', sid: this.mRecord.trk_pkid });
  }

  OnBlur(field: string) {
    var oldChar = / /gi;//replace all blank space in a string
    switch (field) {

      case 'trk_voyage':
        {
          this.mRecord.trk_voyage = this.mRecord.trk_voyage.toUpperCase().trim();
          break;
        }
    }
  }

}
