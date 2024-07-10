import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Blm, Containerm, Containerd } from '../../models/mblm';
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
  bDocs: boolean = false;
  disableSave = true;
  loading = false;
  modal: any;
  selectedId: string = "";
  detailMode = "ADD";
  errorMessage: string[] = [];
  CntrList: Containerm[] = [];
  HblList: Blm[] = [];
  LinkList: Containerd[] = [];
  TrackList: Blm[] = [];
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
    this.bDocs = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
      if (this.menu_record.rights_docs)
        this.bDocs = true;
    }
  }

  ActionHandler(_action: string) {
    this.errorMessage = [];
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
    this.errorMessage = [];
    this.pkid = this.gs.getGuid();
    this.Record = new Blm();
    this.Record.bl_pkid = this.pkid;
    this.Record.bl_slno = undefined;
    this.Record.bl_no ='';
    this.Record.bl_book_no = '';
    this.Record.bl_date = this.gs.defaultValues.today;
    this.Record.bl_type = '';
    if (this.type == "SEA EXPORT")
      this.Record.bl_type = 'MBL-SE';
    else if (this.type == "AIR EXPORT")
      this.Record.bl_type = 'MBL-AE';
    this.Record.rec_category = this.type;
    this.Record.rec_version = 0;
    this.Record.rec_mode = this.mode;
    this.CntrList = new Array<Containerm>();
    this.HblList = new Array<Blm>();
    this.LinkList = new Array<Containerd>();
    this.TrackList = new Array<Blm>();
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
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
      type: this.type
    };
    this.errorMessage = [];
    this.ms.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.loadData(response.record);
        this.CntrList = response.cntrlist;
        this.HblList = response.hbllist;
        this.LinkList = response.linklist;
        this.TrackList = response.tracklist;
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
          this.ActionHandler('ADD');
        });
  }

  loadData(_Record: Blm) {
    this.Record = _Record;
    this.Record.rec_mode = this.mode;
  }


  OnBlur(field: string) {
    switch (field) {
      case 'bl_no':
        {
          this.Record.bl_no = this.Record.bl_no.toUpperCase();
          break;
        }
        // case 'bl_book_no':
        //   {
        //     this.Record.bl_book_no = this.Record.bl_book_no.toUpperCase();
        //     break;
        //   }
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
    this.errorMessage = [];
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
        this.gs.showToastScreen(['Save Complete']);
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
        });
  }

  allvalid() {
    let bret: boolean = true;
    this.errorMessage = [];

    if (this.gs.isBlank(this.Record.bl_no)) {
      bret = false;
      this.errorMessage.push("Master# Cannot Be Blank");
    }
    if (this.gs.isBlank(this.Record.bl_date)) {
      bret = false;
      this.errorMessage.push("Master Date Cannot Be Blank");
    }

    if (bret === false) {
      this.gs.showToastScreen(this.errorMessage);
    }

    return bret;
  }

  Close() {
    this.gs.ClosePage('home', false);
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

  ShowDocuments(doc: any) {
    this.errorMessage = [];
    this.open(doc);
  }
  
  open(content: any) {
    this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
  }
}
