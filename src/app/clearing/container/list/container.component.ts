import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Containerm, SearchQuery } from '../../models/Container';
import { ContainerService } from '../../services/container.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { DateComponent } from '../../../shared/date/date.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html'
})
export class ContainerComponent {
  constructor(
    private modalService: NgbModal,
    public ms: ContainerService,
    private route: ActivatedRoute,
    private router: Router,
    public gs: GlobalService
  ) {
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.gs.checkAppVersion();
    this.ms.init(this.route.snapshot.queryParams);
  }


  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }


  LovSelected(_Record: SearchTable) {
    // if (_Record.controlname == "AGENT-POL") {
    //   this.ms.record.searchQuery.list_pol_agent_id = _Record.id;
    //   this.ms.record.searchQuery.list_pol_agent_name = _Record.name;
    // }
    // else if (_Record.controlname == "AGENT-POD") {
    //   this.ms.record.searchQuery.list_pod_agent_id = _Record.id;
    //   this.ms.record.searchQuery.list_pod_agent_name = _Record.name;
    // }

  }

  ActionHandler(action: string, id: string) {
    this.ms.errorMessage = [];
    if (action == "ADD" && !this.ms.menu_record.rights_add) {
      this.gs.showToastScreen(['Insufficient User Rights'])
      return;
    }
    if (action == "EDIT" && !this.ms.menu_record.rights_edit) {
      this.gs.showToastScreen(['Insufficient User Rights'])
      return;
    }

    var urlid = this.gs.getParameter('urlid');

    let parameter = {
      urlid: this.gs.getGuid(),
      parenturlid: urlid,
      menuid: this.gs.getParameter('menuid'),
      appid: this.gs.globalVariables.appid,
      pkid: id,
      type: this.ms.type,
      origin: 'containerlist',
      mode: action
    };

    this.router.navigate(['clearing/containeredit'], { queryParams: parameter });
  }

  OnBlur(field: string) {

  }

  Close() {
    this.gs.ClosePage('home');
  }

  DeleteRow(_rec: Containerm) {

    if (_rec.cntr_source == "MASTER") {
      this.gs.showToastScreen(['Cannot Delete, Save from another module']);
      return;
    }

    if (!confirm("DELETE " + _rec.cntr_no)) {
      return;
    }

    let SearchData = {
      pkid: _rec.cntr_pkid,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code
    };
    this.ms.errorMessage = [];
    this.ms.DeleteRecord(SearchData)
      .subscribe(response => {
        if (response.retvalue == false) {
          this.ms.errorMessage = this.gs.getErrorArray(response.error);
          this.gs.showToastScreen(this.ms.errorMessage);
        }
        else {
          this.ms.record.recods.splice(this.ms.record.recods.findIndex(rec => rec.cntr_pkid == _rec.cntr_pkid), 1);
        }

      }, error => {

        this.ms.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
        this.gs.showToastScreen(this.ms.errorMessage);
      });
  }

}
