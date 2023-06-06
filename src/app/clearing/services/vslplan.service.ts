
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Planm } from '../models/planm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class VslPlanService {

    title = 'VESSEL PLANNING';
    menuid: string = '';
    type: string = '';
    InitCompleted: boolean = false;
    menu_record: any;
  
    modal: any;
   
    disableSave = true;
    loading = false;
     
    searchstring = '';
   
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;
    urlid: string;
     
    ErrorMessage = "";
    InfoMessage = "";
  
    mode = '';
    pkid = '';
  
    // Array For Displaying List
    RecordList: Planm[] = [];
    // Single Record for add/edit/view details
    Record: Planm = new Planm;

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }


  InitComponent() {
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record)
      this.title = this.menu_record.menu_name;
    this.List("NEW");
  }


  ActionHandler(action: string, id: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    if (action == 'LIST') {
      this.mode = '';
      this.pkid = '';
    }
    else if (action === 'ADD') {
    //   this.mode = 'ADD';
    //   this.ResetControls();
    //   this.NewRecord();
    }
    else if (action === 'EDIT') {
    //   this.pkid = id;
    //   this.mode = 'EDIT';
    //   this.ResetControls();
    //   this.GetRecord(id,'');
    }
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

  // Query List Data
  List(_type: string) {
    this.loading = true;
    let SearchData = {
      type: _type,
      rowtype: this.type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      user_code: this.gs.globalVariables.user_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.VslList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
      },
      error => {
        this.loading = false;
        this.ErrorMessage = this.gs.getError(error);
      });
  }






  VslList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/VslPlan/List', SearchData, this.gs.headerparam2('authorized'));
  }

   
}

