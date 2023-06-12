import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Planm } from '../models/planm';
import { VslPlanService } from '../services/vslplan.service';
import { SearchTable } from '../../shared/models/searchtable';
import { DateComponent } from '../../shared/date/date.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vslplan',
  templateUrl: './vslplan.component.html',
  providers: [VslPlanService]
})
export class VslPlanComponent {
  // sub: any;

  constructor(
    private modalService: NgbModal,
    public ms: VslPlanService,
    private route: ActivatedRoute,
    private router: Router,
    public gs: GlobalService
  ) {
    this.ms.page_count = 0;
    this.ms.page_rows = 10;
    this.ms.page_current = 0;
    const data = this.route.snapshot.queryParams;
    if (data != null) {
      this.ms.InitCompleted = true;
      this.ms.menuid = data.menuid;
      this.ms.type = data.type;
      this.ms.InitComponent();
    }

    // URL Query Parameter 
    // this.sub = this.route.queryParams.subscribe(params => {
    //   let a=10;
    //   if (params["parameter"] != "") {
    //     this.ms.InitCompleted = true;
    //     var options = JSON.parse(params["parameter"]);
    //     this.ms.menuid = options.menuid;
    //     this.ms.type = options.type;
    //     this.ms.InitComponent();
    //   }
    // });
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.ms.InitCompleted) {
      this.ms.InitComponent();
    }
  }


  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    // this.sub.unsubscribe();
  }


  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "AGENT-POL") {
      this.ms.record.searchQuery.list_pol_agent_id = _Record.id;
      this.ms.record.searchQuery.list_pol_agent_name = _Record.name;
    }
    else if (_Record.controlname == "AGENT-POD") {
      this.ms.record.searchQuery.list_pod_agent_id = _Record.id;
      this.ms.record.searchQuery.list_pod_agent_name = _Record.name;
    }
    else if (_Record.controlname == "CONSIGNEE") {
      this.ms.record.searchQuery.list_imp_id = _Record.id;
      this.ms.record.searchQuery.list_imp_name = _Record.name;
    }
    else if (_Record.controlname == "VESSEL") {
      this.ms.record.searchQuery.list_vessel_id = _Record.id;
      this.ms.record.searchQuery.list_vessel_name = _Record.name;
    }
  }

  ActionHandler(action: string, id: string) {
    this.ms.ErrorMessage = '';
    this.ms.InfoMessage = '';

    if (action == "ADD" && !this.ms.menu_record.rights_add) {
      alert('Insufficient User Rights')
      return;
    }
    if (action == "EDIT" && !this.ms.menu_record.rights_edit) {
      alert('Insufficient User Rights')
      return;
    }

    var urlid = this.gs.getParameter('urlid');

    let parameter = {
      urlid: this.gs.getGuid(),
      parenturlid: urlid,
      menuid: this.ms.menuid,
      pkid: id,
      origin: 'vessellist',
      mode: action
    };

    this.router.navigate(['clearing/vslplanedit'], { queryParams: parameter });
  }

  OnBlur(field: string) {

  }

  Close() {
    this.gs.ClosePage('home');
  }


}
