import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { BlList} from '../models/bllist';

@Injectable({ providedIn: 'root' })
export class HouseListService {

  selectcheckbox: boolean = false;
  showdeleted: boolean = false;
  page_count = 0;
  page_current = 0;
  page_rows = 0;
  page_rowcount = 0;
  searchstring = "";
  ErrorMessage = "";
  InfoMessage = "";
  hblstatus = '';
  partnerid = '';
  rowstatus = "";
  fileno = "";
  houseno = "";
  masterno = "";
  pkid="";
  RecordList: BlList[] = [];
  TradingPartners: any[];
  EdiErrorList: [] = [];
  Record: BlList = new BlList;

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
    this.init();
    this.loadCombo();
  }

  init() {
    this.selectcheckbox = false;
    this.page_count = 0;
    this.page_current = 0;
    this.page_rows = 30;
    this.page_rowcount = 0;
    this.searchstring = "";
    this.ErrorMessage = "";
    this.InfoMessage = "";
    this.houseno = "";
    this.masterno = "";
    this.RecordList = []
   
  }

  loadCombo() {
    // this.TradingPartners = this.gs.TradingPartners;
  }

  List(_type: string) {

    let SearchData = {
      type: _type,
      searchstring: this.searchstring.toUpperCase(),
      company_code: this.gs.globalVariables.comp_code,
      branch_code: this.gs.globalVariables.branch_code,
      year_code: this.gs.globalVariables.year_code,
      page_count: this.page_count,
      page_current: this.page_current,
      page_rows: this.page_rows,
      page_rowcount: this.page_rowcount,
      user_code: this.gs.globalVariables.user_code,
      houseno: this.houseno,
      masterno:this.masterno
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.getList(SearchData)
      .subscribe(response => {
        this.RecordList = response.list;
        this.page_count = response.page_count;
        this.page_current = response.page_current;
        this.page_rowcount = response.page_rowcount;
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
  }



  EditRecord(_type: string, _formattype: string) {
    this.ErrorMessage = '';
    this.InfoMessage = '';
    // if (_type == 'PDF' && _formattype == 'BLANKBL') {
    //   if (this.BLPrintFormatList == null)
    //     return;
    //   var REC = this.BLPrintFormatList.find(rec => rec.blf_pkid == this.Record.bl_print_format_id)
    //   if (REC != null) {
    //     if (REC.blf_name == "NA") {
    //       this.ErrorMessage = "\n\r | Please select  print format and continue....";
    //     }
    //   }
    // }
    // if (this.ErrorMessage.length > 0)
    //   return;

    // this.folder_id = this.gs.getGuid();
    // let _colorprint: string = "N";
    // if (this.color_print)
    //   _colorprint = "Y";

    let SearchData = {
      type: _type,
      formattype: _formattype,
      pkid: this.pkid,
      rowtype: 'SEA EXPORT',
      report_folder: this.gs.globalVariables.report_folder,
      folderid: '',
      colorprint: 'N',
      issuedplace: this.gs.defaultValues.bl_issued_place,
      branch_code: this.gs.globalVariables.branch_code,
      invokefrm: ''
    };

    this.GetRecord(SearchData)
      .subscribe(response => {

        // this.mode = 'EDIT';
        if (_type == 'PDF') {
          this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
          var Rec = response.record;
          this.Record.bl_original_print = Rec.bl_original_print;
          this.Record.bl_print = Rec.bl_print;
        }
        else {
          this.LoadData(response.record);
        }
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  LoadData(_Record: BlList) {
    this.Record = _Record;
    // if (this.Record.hbl_seq_format_id.length <= 0)
    //   this.Initdefault('SEQ');
    // this.AttchRecordList = _Record.AttachList;
    // this.NewAttchRecord();

    // if (this.mode == "ADD") {
    //   this.Initdefault('');
    //   this.Record.bl_reg_no = this.gs.defaultValues.bl_reg_no;
    //   this.Record.bl_issued_by1 = this.gs.defaultValues.bl_issued_by1;
    //   this.Record.bl_issued_by2 = this.gs.defaultValues.bl_issued_by2;
    //   this.Record.bl_issued_by3 = this.gs.defaultValues.bl_issued_by3;
    //   this.Record.bl_issued_by4 = this.gs.defaultValues.bl_issued_by4;
    //   this.Record.bl_issued_by5 = this.gs.defaultValues.bl_issued_by5;
    //   if (this.invokefrom == 'HBL')
    //     this.Record.bl_issued_place = this.gs.defaultValues.bl_issued_place;
    // }
    // this.InitLov();
    // this.SHPRRECORD.id = this.Record.bl_shipper_id;
    // this.SHPRRECORD.code = this.Record.bl_shipper_code;

    // this.SHPRADDRECORD.id = this.Record.bl_shipper_br_id;
    // this.SHPRADDRECORD.code = this.Record.bl_shipper_br_no;
    // this.SHPRADDRECORD.parentid = this.Record.bl_shipper_id;

    // this.CNGERECORD.id = this.Record.bl_consignee_id;
    // this.CNGERECORD.code = this.Record.bl_consignee_code;

    // this.CNGEADDRECORD.id = this.Record.bl_consignee_br_id;
    // this.CNGEADDRECORD.code = this.Record.bl_consignee_br_no;
    // this.CNGEADDRECORD.parentid = this.Record.bl_consignee_id;

    // this.NFYRECORD.id = this.Record.bl_notify_id;
    // this.NFYRECORD.code = this.Record.bl_notify_code;

    // this.NFYADDRECORD.id = this.Record.bl_notify_br_id;
    // this.NFYADDRECORD.code = this.Record.bl_notify_br_no;
    // this.NFYADDRECORD.parentid = this.Record.bl_notify_id;
  }

  getList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/House/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/House/List', SearchData, this.gs.headerparam2('authorized'));
  }


}

