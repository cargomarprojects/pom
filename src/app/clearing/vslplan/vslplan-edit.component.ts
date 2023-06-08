import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Planm } from '../models/planm';
import { VslPlanService } from '../services/vslplan.service';
import { SearchTable } from '../../shared/models/searchtable';
import { DateComponent } from '../../shared/date/date.component';
import { Location } from '@angular/common';
import { Joborderm } from '../models/joborder';

@Component({
  selector: 'app-vslplan-edit',
  templateUrl: './vslplan-edit.component.html',
  providers: [VslPlanService]
})
export class VslPlanEditComponent {

  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() mode: string = '';
  @Input() pkid: string = '';



  InitCompleted: boolean = false;
  menu_record: any;
  title: '';

  bChanged: boolean;
  disableSave = true;
  loading = false;

  bPrint: boolean = false;
  searchstring = '';

  modal: any;
  // sub: any;
  urlid: string;
  lock_record: boolean = false;


  ErrorMessage = "";
  InfoMessage = "";


  Record: Planm = new Planm;

  constructor(
    private ms: VslPlanService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) {

    const data = this.route.snapshot.queryParams;
    if (data != null) {
      this.InitCompleted = true;
      this.menuid = data.menuid;
      this.type = data.type;
      this.mode = data.mode;
      this.pkid = data.pkid;
      this.InitComponent();
    }

    // this.sub = this.route.queryParams.subscribe(params => {
    //     if (params["parameter"] != "") {
    //       this.InitCompleted = true;
    //       var options = JSON.parse(params["parameter"]);
    //       this.menuid = options.menuid;
    //       this.type = options.type;
    //       this.mode = options.mode;
    //       this.pkid = options.pkid;
    //       this.InitComponent();
    //     }
    //   });
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    if (!this.InitCompleted) {
      this.InitComponent();
    }
    this.ActionHandler();
  }
  InitComponent() {
    this.bPrint = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_print)
        this.bPrint = true;
    }

  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {
    // this.sub.unsubscribe();
  }


  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == "VESSEL") {
      this.Record.vp_vessel_id = _Record.id;
      this.Record.vp_vessel_code = _Record.code;
      this.Record.vp_vessel_name = _Record.name;
    }
    else if (_Record.controlname == "AGENT-POL") {
      this.Record.vp_pol_agent_id = _Record.id;
      this.Record.vp_pol_agent_code = _Record.code;
      this.Record.vp_pol_agent_name = _Record.name;
    }
    else if (_Record.controlname == "AGENT-POD") {
      this.Record.vp_pod_agent_id = _Record.id;
      this.Record.vp_pod_agent_code = _Record.code;
      this.Record.vp_pod_agent_name = _Record.name;
    }
    else if (_Record.controlname == "CONSIGNEE") {
      this.Record.vp_imp_id = _Record.id;
      this.Record.vp_imp_code = _Record.code;
      this.Record.vp_imp_name = _Record.name;
    }
  }

  ActionHandler() {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.mode === 'ADD') {
      this.ResetControls();
      this.NewRecord();
    }
    else if (this.mode === 'EDIT') {
      this.ResetControls();
      this.GetRecord(this.pkid);
    }
  }

  NewRecord() {
    this.pkid = this.gs.getGuid();
    this.Record = new Planm;
    this.Record.vp_pkid = this.pkid;
    this.Record.vp_plan_date = this.gs.defaultValues.today;
    this.Record.vp_week_no = 0;
    this.Record.vp_etd = '';
    this.Record.vp_vessel_id = '';
    this.Record.vp_vessel_code = '';
    this.Record.vp_vessel_name = '';
    this.Record.vp_voyage = '';
    this.Record.vp_status = 'IN PROGRESS';
    this.Record.vp_comments = '';
    this.Record.vp_pol_agent_id = '';
    this.Record.vp_pol_agent_code = '';
    this.Record.vp_pol_agent_name = '';
    this.Record.vp_pod_agent_id = '';
    this.Record.vp_pod_agent_code = '';
    this.Record.vp_pod_agent_name = '';
    this.Record.vp_imp_id = '';
    this.Record.vp_imp_code = '';
    this.Record.vp_imp_name = '';
    this.Record.rec_mode = this.mode;

  }
  ResetControls() {
    this.disableSave = true;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;
    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;
    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;
    if (this.mode == "EDIT")
      return this.disableSave;
  }


  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string, _type: string = "") {
    this.loading = true;
    let SearchData = {
      pkid: Id,
      type: _type,
      report_folder: this.gs.globalVariables.report_folder,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.ms.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LoadData(response.record);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
          this.mode='ADD';
          this.ActionHandler();
        });
  }

  LoadData(_Record: Planm) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
  }

  // Save Data
  Save() {

    if (!this.allvalid())
      return;
    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.vp_type = 'PLANNING';
    this.Record._globalvariables = this.gs.globalVariables;
    this.ms.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD') {
          this.Record.vp_plan_no = response.planno;
        }
        // this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.ms.RefreshList(this.Record);
        alert('Save Complete');
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

    if (this.Record.vp_plan_date.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Date Cannot Be Blank";
    }
    if (this.Record.vp_pol_agent_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Agent.pol Cannot Be Blank";
    }
    if (this.Record.vp_pod_agent_id.trim().length <= 0) {
      bret = false;
      sError += "\n\r | Agent.pod Cannot Be Blank";
    }
    if (this.Record.vp_week_no <= 0) {
        bret = false;
        sError += "\n\r | Week Number Cannot Be Blank";
    }

    if (bret === false) {
        this.ErrorMessage = sError;
        alert(this.ErrorMessage);
    }

    return bret;
  }




  OnBlur(field: string) {
    switch (field) {
      case 'vp_voyage':
        {
          this.Record.vp_voyage = this.Record.vp_voyage.toUpperCase();
          break;
        }
      case 'vp_comments':
        {
          this.Record.vp_comments = this.Record.vp_comments.toUpperCase();
          break;
        }
    }
  }

  OrderList() {

    this.ErrorMessage = '';
    this.InfoMessage = '';
    //if (this.ord_po.trim().length <= 0) {

    //  this.ErrorMessage += " | PO Cannot Be Blank";
    //}
    // if (this.ErrorMessage)
    //   return;
   
    this.loading = true;
    let SearchData = {
      rowtype: this.ms.type,
      planid: this.Record.vp_pkid,
      polagentid: this.Record.vp_pol_agent_id,
      podagentid: this.Record.vp_pod_agent_id,
      consigneeid: this.Record.vp_imp_id,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.ms.OrderList(SearchData)
      .subscribe(response => {
        this.loading = false;
        // var REC = null;
        //   for (let Rec of response.list) {
        //     REC = this.Record.OrderList.find(a => a.ord_pkid == Rec.ord_pkid);
        //     if (REC == null) {
        //       this.Record.OrderList.push(Rec);
        //     }
        //   }
        this.Record.OrderList = response.list;
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
        alert(this.ErrorMessage);
      });
       
    }

  Close() {
    this.gs.ClosePage('home');
  }


}
