import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { EdiOrder } from '../models/ediorder';
import { EdiOrderService } from '../services/ediorder.service';
import { SearchTable } from '../../shared/models/searchtable';

@Component({
  selector: 'app-edi',
  templateUrl: './edi.component.html',
  providers: [EdiOrderService]
})
export class EdiComponent {
  // Local Variables 
  title = 'EDI Process';

  @Input() menuid: string = '';
  @Input() type: string = '';

  menu_record: any;
  sub: any;
  currentTab = 'LIST';
  bAdmin = false;
  ErrorMessage = "";
  InfoMessage = "";

  constructor(
    private modalService: NgbModal,
    private mainService: EdiOrderService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {

    this.menuid = this.gs.getParameter("menuid");
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
  }

  InitComponent() {
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {
  }

  InitLov() {
  }

  LovSelected(_Record: SearchTable) {
  }

  Process(_type: string) {
    let SearchData = {
      type: _type,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      report_folder: this.gs.globalVariables.report_folder,
      user_code: this.gs.globalVariables.user_code,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.Process(SearchData)
      .subscribe(response => {
        if (response.error == "")
          this.InfoMessage = "Process Complete";
        else
          this.ErrorMessage = response.error;
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
        });
  }

  Close() {
    this.gs.ClosePage('home');
  }

}
