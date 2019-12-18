import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { GlobalService } from '../../core/services/global.service';
import { AlertService } from '../services/alert.service';
import { LovService } from '../services/lov.service';

import { documentm } from '../models/documentm';

@Component({
  selector: 'app-upload',
  templateUrl: './fileupload.component.html'
})
export class FileUploadComponent {

  @Input() public pkid: string = '';
  @Input() public groupid: string = '';
  @Input() public type: string = '';
  @Input() public canupload: boolean = true;
  @Input() public defaultdoctype: string = '';

  title = 'Documents';

  ErrorMessage: string = '';
  InfoMessage: string = '';

  catg_id: string = '';
  DocTypeList: any[] = [];

  copy_type: string = 'MBL-SE';
  copy_no: string = '';

  loading = false;
  myFiles: string[] = [];
  sMsg: string = '';

  constructor(
    public gs: GlobalService,
    private lovService: LovService,
    private alertService: AlertService,
    private http2: HttpClient,
  ) {

  }

  @ViewChild('fileinput',{static:true}) private fileinput: ElementRef;

  RecordList: documentm[] = [];

  RecordList2: documentm[] = [];

  filesSelected: boolean = false;;

  show_docs_list: boolean = false;

  ngOnInit() {
    this.LoadCombo();
  }


  LoadCombo() {

    let sid: string = '';
    this.loading = true;
    let SearchData = {
      type: 'type',
      comp_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code


    };


    this.lovService.LoadDefault(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.DocTypeList = response.dtlist;
        if (this.DocTypeList != null) {
          var REC = this.DocTypeList.find(rec => rec.param_name == this.defaultdoctype);
          if (REC != null) {
            sid = REC.param_pkid;
          }
        }
        if (sid == '') {
          this.DocTypeList.forEach(Rec => {
            sid = Rec.param_pkid;
          });
        }

        this.catg_id = sid;

        this.List("NEW");
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }




  getFileDetails(e: any) {
    //console.log (e.target.files);
    let isValidFile = true;
    let fname: string = '';
    this.filesSelected = false;
    this.myFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.filesSelected = true;
      fname = e.target.files[i].name;
      if (fname.indexOf('&') >= 0)
        isValidFile = false;
      if (fname.indexOf('%') >= 0)
        isValidFile = false;
      if (fname.indexOf('#') >= 0)
        isValidFile = false;
      this.myFiles.push(e.target.files[i]);
    }

    if (!isValidFile) {
      this.filesSelected = false;
      alert('Invalid File Name - &%#');
    }
  }


  uploadFiles() {


    if (this.gs.defaultValues.root_folder == '') {
      alert('Root Folder is blank');
      return;
    }


    if (this.gs.defaultValues.sub_folder == '') {
      alert('Root Folder is blank');
      return;
    }


    if (this.catg_id == '') {
      alert('Pls Select Category');
      return;
    }

    if (!this.filesSelected) {
      alert('No File Selected');
      return;
    }

    this.loading = true;

    let frmData: FormData = new FormData();


    frmData.append("COMPCODE", this.gs.globalVariables.comp_code);
    frmData.append("BRANCHCODE", this.gs.globalVariables.branch_code);
    frmData.append("PARENTID", this.pkid);
    frmData.append("GROUPID", this.groupid);
    frmData.append("TYPE", this.type);
    frmData.append("CATGID", this.catg_id);
    frmData.append("CREATEDBY", this.gs.globalVariables.user_code);

    frmData.append("ROOT-FOLDER", this.gs.defaultValues.root_folder);
    frmData.append("SUB-FOLDER", this.gs.defaultValues.sub_folder);





    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }

    this.http2.post<any>(
      this.gs.baseUrl + '/api/General/UploadFiles', frmData, this.gs.headerparam2('authorized-fileupload')).subscribe(
        data => {
          this.loading = false;
          this.filesSelected = false;
          this.fileinput.nativeElement.value = '';
          this.List('NEW');
          alert('Upload Complete');
        },
        error => {
          this.loading = false;
          alert('Failed');
        }
      );
  }




  List(_type: string, _subtype: string = '') {

    this.loading = true;

    let SearchData = {
      type: this.type,
      subtype: _subtype,
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      parent_id: this.pkid,
      group_id: this.groupid,
      root_folder: this.gs.defaultValues.root_folder,
      sub_folder: this.gs.defaultValues.sub_folder,
      year_code: this.gs.globalVariables.year_code,
    };




    this.lovService.DocumentList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList = response.list;
        // for (let rec of this.RecordList) {
        //   rec.row_displayed=false;
        // }
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }


  ShowFile(filename: string, filedisplayname: string = '') {
    if (filedisplayname == undefined || filedisplayname == '')
      filedisplayname = filename;
    this.Downloadfile(filename, "", filedisplayname);
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  ShowEdiUpdate(_rec: documentm) {
    if (_rec.doc_pkid == null)
      return;
    if (_rec.doc_pkid !== '') {
      _rec.row_displayed = !_rec.row_displayed;
    }
  }

  RemoveList(event: any) {

    if (!event.selected) {
      return;
    }

    this.loading = true;

    let SearchData = {
      pkid: event.id,
      type: this.type,
      parentid: this.pkid,
      user_code: this.gs.globalVariables.user_code
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.lovService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList.splice(this.RecordList.findIndex(rec => rec.doc_pkid == this.pkid), 1);
      },
        error => {
          this.loading = false;
          this.ErrorMessage = this.gs.getError(error);
        });
  }


  showFiles() {

    this.loading = true;

    let SearchData = {
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      copy_type: this.copy_type,
      copy_no: this.copy_no,
      root_folder: this.gs.defaultValues.root_folder,
      sub_folder: this.gs.defaultValues.sub_folder,
      year_code: this.gs.globalVariables.year_code,
    };

    this.lovService.ExtraList(SearchData)
      .subscribe(response => {
        this.loading = false;
        this.RecordList2 = response.list;
        this.show_docs_list = true;
      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });
  }

  CopyFiles() {

    this.loading = true;

    var id = '';
    for (let itm of this.RecordList2) {
      if (itm.doc_selected) {
        if (id != "")
          id += ",";
        id += "'" + itm.doc_pkid + "'";
      }
    }


    let SearchData = {
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      pkids: id,
      parentid: this.pkid,
      type: this.type,
      root_folder: this.gs.defaultValues.root_folder,
      sub_folder: this.gs.defaultValues.sub_folder,
      year_code: this.gs.globalVariables.year_code,
      created_by: this.gs.globalVariables.user_code
    };

    this.lovService.CopyFiles(SearchData)
      .subscribe(response => {
        this.loading = false;

        this.List('LIST');

      },
        error => {
          this.loading = false;
          alert(this.gs.getError(error));
        });


  }



}
