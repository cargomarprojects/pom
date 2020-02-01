import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { EdiOrderService } from '../../services/ediorder.service';

@Component({
  selector: 'app-edierror',
  templateUrl: './edi-error.component.html'
})
export class EdiErrorComponent {
  // Local Variables 
  title = 'EDI Process';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() showHeading : boolean = true;

  menu_record: any;
  sub: any;
  currentTab = 'LIST';
  bAdmin = false;
  ErrorMessage = "";
  InfoMessage = "";

  constructor(
    private modalService: NgbModal,
    private ms: EdiOrderService,
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



  Close() {
    this.gs.ClosePage('home');
  }

}
