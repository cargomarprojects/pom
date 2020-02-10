import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { EdiHblService } from '../../services/edihbl.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
  selector: 'app-edihbl',
  templateUrl: './edihbl.component.html'
})
export class EdiHblComponent {
  // Local Variables 
  title = 'EDI - House';

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() parentid: string = '';
  @Input() showHeading : boolean =true;

  selectedRowIndex: number = -1;
  InitCompleted: boolean = false;
  menu_record: any;
  sub: any;
    
  bAdmin = false;
  bChanged: boolean;
  user_admin = false;

  constructor(
    private modalService: NgbModal,
    public ms: EdiHblService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {
    this.menuid = this.gs.getParameter("menuid");
    this.InitComponent();
  }

  ngOnInit() {
  }

  InitComponent() {
    this.bAdmin = false;
    this.user_admin = false;
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

  LovSelected(_Record: SearchTable) {

  }

  ActionHandler(action: string, id: string, _selectedRowIndex: number = -1) {
  }

  Close() {
    this.gs.ClosePage('home');
  }

  SelectCheckbox() {
    for (var i = 0; i < this.ms.RecordList.length; i++) {
      this.ms.RecordList[i].hbl_selected = this.ms.selectcheckbox;
    }
  }

}

  