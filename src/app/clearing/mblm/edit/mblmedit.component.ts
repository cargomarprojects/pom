import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Blm, Containerm } from '../../models/mblm';
import { MblmListService } from '../../services/mblmlist.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { InputBoxComponent } from '../../../shared/input/inputbox.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'App-mblmedit',
  templateUrl: './mblmedit.component.html'
})
export class MblmEditComponent {
  // Local Variables 
  title = 'Mblm List';
  @Input() menuid: string = '';
  @Input() type: string = '';
  @Input() mode: string = 'ADD';
  @Input() pkid: string = '';

  // @ViewChild('inv_no') private inv_no_ctrl: InputBoxComponent;


  urlid: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  bAdmin = false;
  disableSave = true;
  loading = false;
  modal: any;
  selectedId: string = "";
  detailMode = "ADD";
  ErrorMessage = "";
  InfoMessage = "";
  CntrList: Containerm[] = [];
  Record: Blm = <Blm>{};
  //   Recorddet: Joborderm = new Joborderm;

  constructor(
    private modalService: NgbModal,
    public ms: MblmListService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {
    // URL Query Parameter 
    const data = this.route.snapshot.queryParams;
    if (data != null) {
      this.InitCompleted = true;
      this.menuid = data.menuid;
      this.type = data.type;
      this.mode = data.mode;
      this.pkid = data.pkid;
      this.InitComponent();
    }
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.ActionHandler(this.mode);
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

  ActionHandler(_action: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (_action === 'ADD') {
      this.mode = "ADD";
      this.resetControls();
      this.newRecord();
    }
    else if (_action === 'EDIT') {
      this.mode = "EDIT"
      this.resetControls();
      this.getRecord(this.pkid);
    }
  }


  //// Destroy Will be called when this component is closed
  ngOnDestroy() {

  }


  newRecord() {
    this.ErrorMessage = '';
    this.pkid = this.gs.getGuid();
    this.Record = new Blm();
    this.Record.bl_pkid = this.pkid;
    this.Record.bl_slno = undefined;
    this.Record.bl_date = this.gs.defaultValues.today;
    if (this.type == "SEA EXPORT")
      this.Record.bl_type = 'MBL-SE';
    else
      this.Record.bl_type = 'MBL-AE';
    // this.Record.ordh_detList = new Array<Joborderm>();
    this.Record.rec_category = this.type;
    this.Record.rec_version = 0;
    this.Record.rec_mode = this.mode;
    this.CntrList = new Array<Containerm>();
    this.NewDetRecord();
  }

  resetControls() {
    this.disableSave = true;
    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;
    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;
    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;

    return this.disableSave;
  }

  // Load a single Record for VIEW/EDIT
  getRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id,
      user_code: this.gs.globalVariables.user_code
    };
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.ms.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.loadData(response.record);
        this.CntrList = response.cntrlist;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
          alert(this.ErrorMessage);
          this.ActionHandler('ADD');
        });
  }

  loadData(_Record: Blm) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
    this.NewDetRecord();
  }


  OnBlur(field: string) {
    switch (field) {
      case 'bl_no':
        {
          this.Record.bl_no = this.Record.bl_no.toUpperCase();
          break;
        }


      // case 'ord_cbm':
      //   {
      //     this.Recorddet.ord_cbm = this.gs.roundWeight(this.Recorddet.ord_cbm, "CBM");
      //     break;
      //   }

      case 'ord_color':
        {
          //this.FindContractNo();
          break;
        }
    }
  }


  LovSelected(_Record: SearchTable) {
    // if (_Record.controlname == "SHIPPER") {
    //   this.Record.ordh_exp_id = _Record.id;
    //   this.Record.ordh_exp_name = _Record.name;
    //   this.Record.ordh_exp_code = _Record.code;
    // }

  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  // Save Data
  Save() {

    if (!this.allvalid())
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.Record.rec_category = this.type;
    this.Record._globalvariables = this.gs.globalVariables;
    this.ms.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        if (this.mode == 'ADD') {
          this.Record.bl_slno = response.slno;
        }
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.Record.rec_version = response.version;
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

    if (this.gs.isBlank(this.Record.bl_no)) {
      bret = false;
      sError += "\n\r | MBL# Cannot Be Blank";
    }
    if (this.gs.isBlank(this.Record.bl_date)) {
      bret = false;
      sError += "\n\r | MBL Date Cannot Be Blank";
    }


    if (bret === false) {
      this.ErrorMessage = sError;
      alert(this.ErrorMessage);
    }

    return bret;
  }


  Close() {
    this.gs.ClosePage('home', false);
  }

  AddRecord() {

    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    // if (this.gs.isBlank(this.Recorddet.ord_invno)) {
    //   bret = false;
    //   sError += " | Invoice number cannot be blank";
    // }

    // if (this.gs.isBlank(this.Recorddet.ord_po)) {
    //   bret = false;
    //   sError += " | PO cannot be blank";
    // }

    // if (this.gs.isBlank(this.Recorddet.ord_desc)) {
    //   bret = false;
    //   sError += " | Description cannot be blank";
    // }

    // if (bret === false) {
    //   alert(sError);
    //   return;
    // }

    // if (this.detailMode == "ADD") {
    //   this.Record.ordh_detList.push(this.Recorddet);
    // } else {
    //   var REC2 = this.Record.ordh_detList.find(rec => rec.ord_pkid == this.Recorddet.ord_pkid);
    //   if (REC2 != null) {
    //     REC2.ord_invno = this.Recorddet.ord_invno;
    //     REC2.ord_uneco = this.Recorddet.ord_uneco;
    //     REC2.ord_po = this.Recorddet.ord_po;
    //     REC2.ord_style = this.Recorddet.ord_style;
    //     REC2.ord_color = this.Recorddet.ord_color;
    //     REC2.ord_contractno = this.Recorddet.ord_contractno;
    //     REC2.ord_pkg = this.Recorddet.ord_pkg;
    //     REC2.ord_pcs = this.Recorddet.ord_pcs;
    //     REC2.ord_ntwt = this.Recorddet.ord_ntwt;
    //     REC2.ord_grwt = this.Recorddet.ord_grwt;
    //     REC2.ord_cbm = this.Recorddet.ord_cbm;
    //     REC2.ord_hs_code = this.Recorddet.ord_hs_code;
    //     REC2.ord_desc = this.Recorddet.ord_desc;
    //     REC2.ord_boarding1 = this.Recorddet.ord_boarding1;
    //     REC2.ord_boarding2 = this.Recorddet.ord_boarding2;
    //     REC2.ord_instock1 = this.Recorddet.ord_instock1;
    //     REC2.ord_instock2 = this.Recorddet.ord_instock2;
    //     REC2.ord_cargo_readiness_date = this.Recorddet.ord_cargo_readiness_date;
    //   }
    // }
    // this.isPrevDetails = true;
    this.NewDetRecord();
  }

  NewDetRecord() {
    this.detailMode = "ADD";
    // let _preRecDet = this.Recorddet;
    // this.Recorddet = new Joborderm();
    // this.Recorddet.ord_pkid = this.gs.getGuid();;
    // this.Recorddet.ord_header_id = this.pkid;
    // this.Recorddet.ord_uid = 0;
    // this.Recorddet.ord_status = 'REPORTED';

  }


  EditRecord(_rec: Blm) {
    this.detailMode = "EDIT";
    // this.Recorddet = new Joborderm();
    // this.Recorddet.ord_pkid = _rec.ord_pkid;
    // this.Recorddet.ord_header_id = this.pkid;
    // this.Recorddet.ord_invno = _rec.ord_invno;
    // this.Recorddet.ord_uneco = _rec.ord_uneco;

  }

  DeleteRow(_rec: Blm) {

    if (!confirm("Delete selected row")) {
      return;
    }
    // if (!this.gs.isBlank(this.ms.record.records))
    //   this.ms.record.records.splice(this.ms.record.records.findIndex(rec => rec.ord_pkid == _rec.ord_pkid), 1);
  }

  CloseModal1(params: any) {
    this.modal.close();
  }

  selectRowId(id: string) {
    this.selectedId = id;
  }
  getRowId() {
    return this.selectedId;
  }
}
