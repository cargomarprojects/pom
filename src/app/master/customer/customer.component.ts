import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Customerm } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Addressm } from '../models/addressm';
import { Location } from '@angular/common';

@Component({
  selector: 'app-customerm',
  templateUrl: './customer.component.html',
  providers: [CustomerService]
})
export class CustomerComponent {

  // Local Variables 
  title = 'Address MASTER';

  @ViewChild('addressComponent', { static: true }) addressComponent: any;


  mdate: string;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;


  bCreditLimit: boolean = false;
  showalert = false;
  CrList: any[];


  bAdmin = false;//for detail part
  bDocs = false;
  bDocsUpload = false;
  canadd = true;
  bPrint = false;
  bAdmin2 = false;//for list part
  bDelete = false;

  modal: any;
  disableSave = true;
  loading = false;
  currentTab = 'LIST';

  searchstring = '';
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;

  sub: any;
  urlid: string;

  public errorMessage: string[] = [];
  // ErrorMessage = "";
  // InfoMessage = "";

  mode = '';
  pkid = '';

  cust_linked: boolean = false;
  Is_Shipper: boolean = false;
  Is_Consignee: boolean = false;
  Is_Agent: boolean = false;
  Is_Buy_Agent: boolean = false;
  Is_Cha_Forwarder: boolean = false;
  Is_Creditor: boolean = false;
  Is_Others: boolean = false;
  Last_Bill_date: boolean = false;

  rec_category: string;
  // Array For Displaying List
  RecordList: Customerm[] = [];
  // Single Record for add/edit/view details
  Record: Customerm = new Customerm;



  TypeList: any[] = [];
  ClassList: any[] = [];
  StateList: any[] = [];
  CountryList: any[] = [];

  // Acc Group , Acc Type
  AcGrpList: any[] = [];
  AcTypeList: any[] = [];




  constructor(
    private modalService: NgbModal,
    private mainService: CustomerService,
    private location: Location,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {

    this.page_count = 0;
    this.page_rows = 25;
    this.page_current = 0;



    this.InitCompleted = true;
    this.menuid = this.gs.getParameter('menuid');
    this.type = this.gs.getParameter('type');
    this.rec_category = this.type;
    this.InitComponent();

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.LoadCombo();
  }

  InitComponent() {
    this.bDelete = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin2 = true;
      if (this.menu_record.rights_delete)
        this.bDelete = true;
    }

    if (this.gs.globalVariables.user_code == "ADMIN")
      this.bAdmin2 = true;

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }






  LoadCombo() {

    this.ClassList = [{ "name": "Private" }, { "name": "Public" }];

    this.loading = true;
    let SearchData = {
      type: 'type',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code
    };

    this.errorMessage = [];
    this.mainService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.StateList = response.statelist;
        this.CountryList = response.countrylist;
        // this.AcGrpList = response.acgroupm;
        // this.AcTypeList = response.actypem;
        this.List("NEW");
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
        });
  }


  LovSelected(_Record: any) {

    if (_Record.controlname == "SALESMAN") {
      this.Record.cust_sman_id = _Record.id;
      this.Record.cust_sman_name = _Record.name;
    }

  }



  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.errorMessage = [];
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
    }
    else if (action === 'ADD') {
      this.currentTab = 'DETAILS';
      this.mode = 'ADD';
      this.ResetControls();
      this.NewRecord();
    }
    else if (action === 'EDIT') {
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
      this.GetRecord(id);
    }
  }


  ResetControls() {
    this.disableSave = true;
    this.canadd = true;
    this.bAdmin = true;
    this.bDocs = true;
    this.bDocsUpload = true;

    if (!this.menu_record)
      return;

    if (this.menu_record.rights_admin)
      this.disableSave = false;

    if (this.mode == "ADD" && this.menu_record.rights_add)
      this.disableSave = false;

    if (this.mode == "EDIT" && this.menu_record.rights_edit)
      this.disableSave = false;

    this.bAdmin = false;
    if (this.mode == "EDIT" && this.menu_record.rights_admin)
      this.bAdmin = true;

    this.bDocs = false;
    if (this.mode == "EDIT" && this.menu_record.rights_docs)
      this.bDocs = true;

    this.bDocsUpload = false;
    if (this.mode == "EDIT" && this.menu_record.rights_docs_upload)
      this.bDocsUpload = true;


    if (this.gs.globalVariables.user_code == "ADMIN")
      this.bAdmin = true;


    this.canadd = this.menu_record.rights_add;


    return this.disableSave;
  }

  // Query List Data
  List(_type: string) {

    this.loading = true;

    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      Is_Shipper: this.Is_Shipper,
      Is_Consignee: this.Is_Consignee,
      Is_Agent: this.Is_Agent,
      Is_Buy_Agent: this.Is_Buy_Agent,
      Is_Cha_Forwarder: this.Is_Cha_Forwarder,
      Is_Creditor: this.Is_Creditor,
      Is_Others: this.Is_Others,
      Last_Bill_date: this.Last_Bill_date,
      report_folder: this.gs.globalVariables.report_folder,
      rec_category: this.rec_category,
    };

    this.errorMessage = [];
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (_type == 'EXCEL')
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
        else {
          this.RecordList = response.list;
          this.page_count = response.page_count;
          this.page_current = response.page_current;
          this.page_rowcount = response.page_rowcount;
        }
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  NewRecord() {



    this.pkid = this.gs.getGuid();

    this.Record = new Customerm();
    this.Record.cust_pkid = this.pkid;
    this.Record.cust_code = '';
    this.Record.cust_name = '';

    this.Record.cust_edi_code = '';
    this.Record.cust_trading_partner = '';

    this.Record.cust_iecode = '';
    this.Record.cust_panno = '';
    this.Record.cust_tanno = '';
    this.Record.cust_class = 'N';
    this.Record.cust_type = 'N';


    this.Record.cust_sepz_unit = false;
    this.Record.cust_linked = false;
    this.Record.cust_is_shipper = false;
    this.Record.cust_is_ungst = false;
    this.Record.cust_is_foreigner = false;
    this.Record.cust_is_consignee = false;
    this.Record.cust_is_agent = false;
    this.Record.cust_is_cha = false;
    this.Record.cust_is_creditor = false;
    this.Record.cust_is_others = false;
    this.Record.rec_locked = false;

    this.Record.cust_crdays = 1;
    this.Record.cust_crlimit = 1;

    this.Record.cust_crdate = '';

    this.Record.cust_sman_id = '';
    this.Record.cust_sman_name = '';

    this.Record.cust_remarks = '';

    this.Record.cust_csd_id = '';
    this.Record.cust_csd_name = '';

    this.Record.cust_referdby = '';

    this.Record.cust_dbkacno = '';
    this.Record.cust_adcode = '';
    this.Record.cust_bank = '';
    this.Record.cust_bank_branch = '';
    this.Record.cust_acno = '';
    this.Record.cust_forexacno = '';
    this.Record.cust_bank_address1 = '';
    this.Record.cust_bank_address2 = '';
    this.Record.cust_bank_address3 = '';

    this.Record.cust_branch_code = '';

    this.Record.cust_linked = false;
    this.cust_linked = false;
    this.Record.cust_nomination = 'NA';
    this.Record.rec_mode = this.mode;


  }




  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
    };

    this.errorMessage = [];
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.LoadData(response.record);
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
        });
  }

  LoadData(_Record: Customerm) {
    this.Record = _Record;

    this.cust_linked = this.Record.cust_linked;
    this.Record.AddressList = _Record.AddressList;

    this.Record.rec_mode = this.mode;


  }

  // Save Data
  Save() {
    if (!this.allvalid()) {
      return;
    }

    this.loading = true;
    this.errorMessage = [];

    this.Record._globalvariables = this.gs.globalVariables;

    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.errorMessage.push("Save Complete"); 
        this.gs.showToastScreen(this.errorMessage);
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;

        if (response.STATUS == "SPECIAL CHARACTER") {
          alert("Specical Character Found In Address, Pls Re-Check Data");
        }
        this.RefreshList();
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
          this.gs.showToastScreen(this.errorMessage);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.errorMessage = [];

    if (this.gs.isBlank(this.Record.cust_code)) {
      bret = false;
      this.errorMessage.push("Code Cannot Be Blank");
    }

    if (this.gs.isBlank(this.Record.cust_name)) {
      bret = false;
      this.errorMessage.push("Name Cannot Be Blank");
    }

    if (this.Record.cust_is_consignee) {
      if (this.gs.isBlank(this.Record.cust_edi_code)) {
        bret = false;
        this.errorMessage.push("Edi Code Cannot be Blank");
      }
    }



    if (bret) {
      this.Record.cust_code = this.Record.cust_code.toUpperCase().replace(' ', '');
      this.Record.cust_name = this.Record.cust_name.toUpperCase().trim();
      this.Record.cust_iecode = this.Record.cust_iecode.toUpperCase().trim();
    }

    if (bret === false)
      this.gs.showToastScreen(this.errorMessage);

    return bret;
  }

  Isnumeric(i: any) {

    if (i >= 0 && i <= 9) {
      return true;
    }
    else {
      return false;
    }

  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.cust_pkid == this.Record.cust_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.cust_code = this.Record.cust_code;
      REC.cust_name = this.Record.cust_name;
    }
  }


  OnBlur(field: string) {
  }

  Close() {
    this.gs.ClosePage('home');
  }

  open(content: any) {
    this.modal = this.modalService.open(content);
  }
  ShowHistory(history: any) {
    this.errorMessage = [];
    this.open(history);
  }

  Return() {
    if (this.currentTab == 'DETAILS')
      this.ActionHandler('LIST', '');
    else
      this.location.back();
  }

  DeleteRow(_rec: Customerm) {

    if (!confirm("DELETE " + _rec.cust_name)) {
      return;
    }
    this.loading = true;
    let SearchData = {
      pkid: _rec.cust_pkid,
      group: _rec.cust_group,
      cust_name: _rec.cust_name,
      sman_name: _rec.cust_sman_name,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code
    };
    this.errorMessage = [];
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.retvalue == false) {
          this.errorMessage = this.gs.getErrorArray(response.error);
          this.gs.showToastScreen(this.errorMessage);
        }
        else {
          this.RecordList.splice(this.RecordList.findIndex(rec => rec.cust_pkid == _rec.cust_pkid), 1);
        }

      }, error => {
        this.loading = false;
        this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
        this.gs.showToastScreen(this.errorMessage);
      });
  }

}
