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
  ErrorMessage = "";
  InfoMessage = "";

  ord_status = 'APPROVED';

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

    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.gs.isBlank(this.ord_pkids)) {
      this.ErrorMessage = " Cannot Update Invalid ID";
      return;
    }

    let SearchData = {
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      pkids: this.ord_pkids,
      status: this.ord_status,
      user_code: this.gs.globalVariables.user_code
    };

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.mainService.ChangeStatus(SearchData)
      .subscribe(response => {
        this.InfoMessage = "Save Complete";
        this.ids = response.list;
        //var urlid = this.gs.getParameter('urlid');
        // this.store.dispatch( FromOrderActions.ChangeStatus({urlid: urlid, pkids: this.ids})  )
        this.closeModalWindow.emit({ saction: 'STATUS-SAVE', result:response.list });
      }, error => {
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }

  Close() {
    this.closeModalWindow.emit({ saction: 'CLOSE' });
  }


}
