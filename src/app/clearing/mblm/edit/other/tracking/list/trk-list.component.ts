import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../../../core/services/global.service';
import { Trackingm } from '../../../../../models/tracking';
import { TrkService } from '../../../../../services/trk.service';
import { SearchTable } from '../../../../../../shared/models/searchtable';

@Component({
  selector: 'app-trk-list',
  templateUrl: './trk-list.component.html',
  providers: [TrkService]
})
export class TrkListComponent {
  // Local Variables
  title = 'Container List';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  @Input() RecordList: Trackingm[] = [];

  modal: any;
  selectedId: string = '';
  loading = false;
  CntrTypes: string = "";

  private errorMessage: string[] = [];

  mode = 'ADD';
  pkid = '';
  ctr: number;
  modalRef: any;


  // Array For Displaying List

  // Single Record for add/edit/view details
  Record: Trackingm = new Trackingm;

  constructor(
    private ms: TrkService,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private modalService: NgbModal,
  ) {
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    // this.List('NEW');
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  LoadDefault() {

    // this.loading = true;
    // let SearchData = {
    //   pkid: this.parentid,
    //   comp_code: this.gs.globalVariables.comp_code,
    //   branch_code: this.gs.globalVariables.branch_code,

    // };

    // this.ErrorMessage = '';
    // this.InfoMessage = '';
    // this.ms.LoadDefault(SearchData)
    //   .subscribe(response => {
    //     this.loading = false;
    //   },
    //     error => {
    //       this.loading = false;
    //       this.ErrorMessage = this.gs.getError(error);
    //       alert(this.ErrorMessage);
    //     });

  }


  LovSelected(_Record: SearchTable) {

  }

  List(_type: string) {
    // this.loading = true;
    // let SearchData = {
    //     type: _type,
    //     rowtype: this.type,
    //     parentid: this.parentid,
    //     company_code: this.gs.globalVariables.comp_code,
    //     branch_code: this.gs.globalVariables.branch_code,
    //     year_code: this.gs.globalVariables.year_code
    // };
    // this.errorMessage = [];
    // this.ms.List(SearchData)
    //     .subscribe(response => {
    //         this.loading = false;
    //         this.RecordList = response.list;
    //
    //     },
    //         error => {
    //             this.loading = false;
    //             this.errorMessage.push(this.gs.getError(error));
    //             this.gs.showToastScreen(this.errorMessage);
    //         });
  }

  selectRowId(id: string) {
    this.selectedId = id;
  }
  getRowId() {
    return this.selectedId;
  }

  Close() {
    this.gs.ClosePage('home');
  }

  ShowTracking(modalname: any) {
    this.modalRef = this.modalService.open(modalname, { centered: true, backdrop: 'static', keyboard: true });
  }

  CloseModal(params: any) {

    if (params.saction == "SAVE") {
      this.RecordList = params.list;
    }
    this.modalRef.close();
  }

  refreshTracking() {

  }

}



