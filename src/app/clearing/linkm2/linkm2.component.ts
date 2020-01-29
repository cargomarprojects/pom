import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { Linkm2Service } from '../services/linkm2.service';
import { SearchTable } from '../../shared/models/searchtable';
import { targetlistm } from '../../master/models/targetlistm';
import { edi_link } from '../models/edi_link';
@Component({
  selector: 'app-mapping',
  templateUrl: './linkm2.component.html',
  providers: [Linkm2Service]
})
export class Linkm2Component {
  // Local Variables 
  title = 'Master Linking';

  mdate: string;
  @Input() showheader: boolean = true;

  @Input() menuid: string = '';
  @Input() type: string = '';
  InitCompleted: boolean = false;
  menu_record: any;

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

  ErrorMessage = "";
  InfoMessage = "";

  tl_pkid = '';
  mode = '';
  pkid = '';
  targetcode: string = "";
  targetname: string = "";

  link_type = 'INWARD';
  link_status = '';
  link_sender = '';
  link_subcategory = '';


  controlname ='';
  tabletype='';
  subtype='';
  displaydata='';
  

  RecordList2: targetlistm[] = [];

  // Array For Displaying List
  RecordList: edi_link[] = [];
  // Single Record for add/edit/view details
  Record: edi_link = new edi_link;

  TradingPartners : any [];

  constructor(
    private mainService: Linkm2Service,
    private route: ActivatedRoute,
    private gs: GlobalService

  ) {
    this.page_count = 0;
    this.page_rows = 10;
    this.page_current = 0;

    this.menuid = this.gs.getParameter('menuid');
    this.type = '';

  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.InitComponent();
    this.loadCombo();
  }
 

  loadCombo(){

    this.TradingPartners = this.gs.TradingPartners;
    if ( this.TradingPartners.length >0)
      this.link_sender = this.TradingPartners[0].param_code;

/*
    let SearchRecord = {
      table : 'PARAM',
      comp_code : this.gs.globalVariables.comp_code,
      param_type : 'PARAM'
    }
    this.gs.SearchRecord(SearchRecord).subscribe(
      response =>{
        this.TradingPartners = response.param;
        if ( response.param.length > 0){
          this.link_sender =   response.param[0].param_code;
        }
      },
      error =>{
        this.ErrorMessage = this.gs.getError(error);
      });
*/
  }

  InitComponent() {

    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;

  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }



  //function for handling LIST/NEW/EDIT Buttons
  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
      this.currentTab = 'LIST';
    }
    else if (action === 'EDIT') {
      this.currentTab = 'DETAILS';
      this.mode = 'EDIT';
      this.ResetControls();
      this.pkid = id;
      this.GetRecord(id);
    }
  }

  // Load a single Record for VIEW/EDIT
  GetRecord(Id: string) {
    this.loading = true;

    let SearchData = {
      pkid: Id,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.GetRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.Record = response.record;
        this.Record.rec_mode = this.mode;
      
        this.controlname = this.Record.link_category;
        this.tabletype =  this.Record.link_subcategory;
        this.displaydata = '';
        
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  LovSelected(_Record: any) {
      this.Record.link_target_id = _Record.id;
      this.Record.link_target_name = _Record.name;
  }



  // Query List Data
  List(_type: string) {

    this.loading = true;

    let SearchData = {
      company_code: this.gs.globalVariables.comp_code,
      branch_code: '',
      link_sender: this.link_sender,
      link_type: this.link_type,
      link_status: this.link_status,
      link_subcategory: this.link_subcategory,
      searchstring: this.searchstring,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.List(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  NewRecord() {
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
    return this.disableSave;
  }





  // Save Data
  Save() {

    if (!this.allvalid())
      return;

    this.loading = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';

    this.Record._globalvariables = this.gs.globalVariables;

    this.mainService.Save(this.Record)
      .subscribe(response => {
        this.loading = false;
        this.InfoMessage = "Save Complete";
        this.mode = 'EDIT';
        this.Record.rec_mode = this.mode;
        this.RefreshList();
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  allvalid() {
    let sError: string = "";
    let bret: boolean = true;
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (this.Record.link_category.trim().length <= 0) {
      bret = false;
      sError = " | Category Cannot Be Blank";
    }

    if (bret === false)
      this.ErrorMessage = sError;
    return bret;
  }

  RefreshList() {

    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.link_pkid == this.Record.link_pkid);
    if (REC == null) {
      this.RecordList.push(this.Record);
    }
    else {
      REC.link_target_id = this.Record.link_target_id;
      REC.link_target_name = this.Record.link_target_name;
    }

  }


  OnBlur(field: string) {
    switch (field) {
      case 'targetcode':
        {
          this.targetcode = this.targetcode.toUpperCase();
          break;
        }
      case 'targetname':
        {
          this.targetname = this.targetname.toUpperCase();
          break;
        }
    }
  }

  OnChange(field: string) {
  }

  RemoveList(event: any) {
    if (event.selected) {
      this.RemoveRecord(event.id);
    }
  }

  RemoveRecord(Id: string) {
    this.loading = true;
    let SearchData = {
      pkid: Id
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.mainService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.SetBlankValue(Id);
        //this.RecordList.splice(this.RecordList.findIndex(rec => rec.link_pkid == Id), 1);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  SetBlankValue(id: string) {
    if (this.RecordList == null)
      return;
    var REC = this.RecordList.find(rec => rec.link_pkid == id);
    if (REC != null) {
      REC.link_target_id = '';
      REC.link_target_name = '';
      REC.link_status = 'N';
    }
  }


  Close() {
    this.gs.ClosePage('home');
  }


}
