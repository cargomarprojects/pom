import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Location } from '@angular/common';
import { TrackOrderService } from '../services/trackorder.service';

// import * as FromOrderActions from '../orderlist/list/store/orderlist.actions';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  providers: [TrackOrderService]
})
export class StatusComponent {
  // Local Variables 
  title = 'Track Details';
  @Input() public ord_pkids: string = '';
  @Input() public ord_pos: string = '';
  @Input() public ord_header_id: string = '';
  @Output() ChangeStatus = new EventEmitter<any>();
  @Output() closeModalWindow = new EventEmitter<any>();


  private menuid: string = '';
  private type: string = '';
  // pkid: string;
  // refno: string = '';

  ids: any[];

  InitCompleted: boolean = false;
  menu_record: any;

  disableSave = true;
  loading = false;
  currentTab = 'LIST';
  sub: any;
  urlid: string;
  mode = 'EDIT';
  private errorMessage: string[] = [];
  // ErrorMessage = "";
  // InfoMessage = "";

  ord_status = 'SENT FOR APPROVAL';

  constructor(
    private mainService: TrackOrderService,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private location: Location,
  ) {

    //this.menuid = options.menuid;
    //this.type = options.type;

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
    this.errorMessage = [];
    if (this.gs.isBlank(this.ord_pkids) && this.gs.isBlank(this.ord_header_id)) {
      this.errorMessage.push("Cannot Update Invalid ID");
      this.gs.showToastScreen(this.errorMessage);
      return;
    }

    let SearchData = {
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      pkids: this.ord_pkids,
      status: this.ord_status,
      user_code: this.gs.globalVariables.user_code,
      header_id: this.ord_header_id
    };

    this.loading = true;
    this.errorMessage = [];
    this.mainService.ChangeStatus(SearchData)
      .subscribe(response => {
        this.errorMessage.push("Save Complete");
        this.gs.showToastScreen(this.errorMessage);
        this.ids = response.list;
        //var urlid = this.gs.getParameter('urlid');
        // this.store.dispatch( FromOrderActions.ChangeStatus({urlid: urlid, pkids: this.ids})  )
        this.closeModalWindow.emit({ saction: 'STATUS-SAVE', result: response.list });
      }, error => {
        this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
        this.gs.showToastScreen(this.errorMessage);
      });

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }

  Close() {
    this.closeModalWindow.emit({ saction: 'CLOSE' });
  }


}
