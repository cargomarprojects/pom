import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { SearchQuery } from '../../models/joborder';
import { SearchTable } from 'src/app/shared/models/searchtable';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { SelectSelectedRecordsCount,SelectPkidsPos } from './store/orderlist.selctors';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
  selector: 'app-orderlist-header',
  templateUrl: 'orderlist.header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OrderListHeaderComponent implements OnInit {

  query: SearchQuery;
  @Input() set _query(value: SearchQuery) {
    this.query = JSON.parse(JSON.stringify(value));
  }

  @Output() searchEvents = new EventEmitter<any>();

  selectedRecordsCount$: Observable<number>;
  total = 0;

  SelectPkidsPos$: Observable<string>;
  ord_id_POs = "";

  SortList: any[];

  where_agent = "CUST_IS_AGENT = 'Y'";
  where_shipper = "CUST_IS_SHIPPER = 'Y'";
  where_consignee = "CUST_IS_CONSIGNEE = 'Y'";

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private gs: GlobalService,
  ) {
    this.selectedRecordsCount$ = this.store.pipe(
      select(SelectSelectedRecordsCount),
      tap(total => this.total = total)
    );
    this.SelectPkidsPos$ = this.store.pipe(
      select(SelectPkidsPos),
      tap(ord_id_POs => this.ord_id_POs = this.ord_id_POs)
    );
  }


  ngOnInit() {
    this.SortList = [
      { "colheadername": "CREATED", "colname": "a.rec_created_date desc" },
      { "colheadername": "AGENT,SHIPPER,PO", "colname": "agent.cust_name,exp.cust_name,ord_po" }
    ];
  }

  List(outputformat: string) {

    var sdata = this.SortList.find(rec => rec.colheadername == this.query.sort_colname).colname;
    if (sdata)
      this.query.sort_colvalue = sdata;


    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.query });
  }

  LovSelected(_Record: SearchTable) {
    // Company Settings
    if (_Record.controlname == "AGENT") {
      this.query.list_agent_id = _Record.id;
      this.query.list_agent_name = _Record.name;
    }
    if (_Record.controlname == "SHIPPER") {
      this.query.list_exp_id = _Record.id;
      this.query.list_exp_name = _Record.name;
    }
    if (_Record.controlname == "CONSIGNEE") {
      this.query.list_imp_id = _Record.id;
      this.query.list_imp_name = _Record.name;
    }
  }

  tracking() {

    if (this.total <= 0) {
      alert('No Rows Selected');
      return;
    }
    var urlid = this.gs.getParameter('urlid');
    let parameter = {
      urlid: urlid,
      type: '',
      origin: 'orderlist',
    };
    this.router.navigate(['clearing/tracking'], { queryParams: parameter });

  }


  MailOrders(_filetype: string = "") {
   
    if (this.ord_id_POs =='') {
      alert('Please select PO and continue.....');
      return;
    }
   
    this.query.ftp_ordpoids = this.ord_id_POs;
    this.query.ftp_is_checklist = 'N';
    this.query.ftp_is_multipleorder = 'Y';
    if (_filetype === "CHECK-LIST") {
      this.query.ftp_is_checklist = 'Y';
    } else if (_filetype === "FTP") {
      this.query.ftp_is_checklist = 'N';
    }
    this.List('MAIL-FTP')

    // this.InfoMessage = '';
    // this.ErrorMessage = '';
    // this.ftp_agent_code = '';
    // this.ftp_agent_name = '';
    // let ord_ids: string = '';
    // let ord_id_POs: string = '';
    // let POID_Is_Blank: Boolean = false;
    // if (sType == 'MULTIPLE') {
    //   ord_ids = "";
    //   ord_id_POs = "";
    //   for (let rec of this.RecordList) {
    //     if (rec.ord_selected) {
    //       if (ord_ids != "")
    //         ord_ids += ",";
    //       ord_ids += rec.ord_pkid;

    //       if (ord_id_POs != "")
    //         ord_id_POs += ",";
    //       ord_id_POs += rec.ord_pkid + "~PO-" + rec.ord_po;

    //       if (this.ftpTransfertype == 'TRACKING')
    //         if (rec.ord_uid == 0)
    //           POID_Is_Blank = true;

    //       this.ftp_agent_code = rec.ord_agent_code;
    //       this.ftp_agent_name = rec.ord_agent_name;
    //     }
    //   }

    //   if (ord_ids == "") {
    //     this.ErrorMessage = " Please select PO and continue.....";
    //     alert(this.ErrorMessage);
    //     return;
    //   }
    //   this.pkid = ord_ids;
    // } else {
    //   for (let rec of this.RecordList.filter(rec => rec.ord_pkid == this.pkid)) {
    //     this.ftp_agent_code = rec.ord_agent_code;
    //     this.ftp_agent_name = rec.ord_agent_name;
    //     if (this.ftpTransfertype == 'TRACKING' && rec.ord_uid == 0)
    //       POID_Is_Blank = true;
    //   }
    // }


    // if (this.pkid.trim().length <= 0) {
    //   this.ErrorMessage = "\n\r | Invalid ID";
    //   return;
    // }
    // if (POID_Is_Blank) {
    //   this.ErrorMessage = " PO.ID Not Found ";
    //   alert(this.ErrorMessage);
    //   return;
    // }

    // this.loading = true;
    // this.ErrorMessage = '';
    // let SearchData = {
    //   report_folder: this.gs.globalVariables.report_folder,
    //   company_code: this.gs.globalVariables.comp_code,
    //   branch_code: this.gs.globalVariables.branch_code,
    //   rowtype: _filetype,
    //   type: '',
    //   pkid: '',
    //   filedisplayname: ''
    // };

    // SearchData.report_folder = this.gs.globalVariables.report_folder;
    // SearchData.branch_code = this.gs.globalVariables.branch_code;
    // SearchData.company_code = this.gs.globalVariables.comp_code;
    // SearchData.type = this.ftpTransfertype;
    // SearchData.pkid = this.pkid;
    // SearchData.rowtype = _filetype;
    // SearchData.filedisplayname = '';
    // this.mainService.GenerateXmlEdiMexico(SearchData)
    //   .subscribe(response => {
    //     this.loading = false;
    //     if (_filetype == 'CHECK-LIST') {
    //       this.gs.DownloadFile(this.gs.globalVariables.report_folder, response.filename, response.filetype, response.filedisplayname);
    //     } else {
    //       this.sSubject = response.subject;
    //       this.ftpUpdtSql = response.updatesql;
    //       if (sType == 'MULTIPLE')
    //         this.pkid = ord_id_POs;//pkid and pos for ftplog separate record
    //       this.AttachList = new Array<any>();
    //       if (this.ftpTransfertype == 'ORDERLIST') {
    //         this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filecategory: 'ORDER', fileftpfolder: 'FTP-FOLDER-PO-CREATE', fileisack: 'N', fileprocessid: response.processid, filesize: response.filesize });
    //         this.AttachList.push({ filename: response.filenameack, filetype: response.filetypeack, filedisplayname: response.filedisplaynameack, filecategory: 'ORDER', fileftpfolder: 'FTP-FOLDER-PO-CREATE-ACK', fileisack: 'Y', fileprocessid: response.processid, filesize: response.filesizeack });
    //       } else //TRACKING CARGO PROCESS
    //         this.AttachList.push({ filename: response.filename, filetype: response.filetype, filedisplayname: response.filedisplayname, filecategory: 'CARGO PROCESS', fileftpfolder: 'FTP-FOLDER-PO-DATA', fileisack: 'N', fileprocessid: response.processid, filesize: response.filesize });
    //       this.open(ftpsent);
    //     }
    //   },
    //     error => {
    //       this.loading = false;
    //       this.ErrorMessage = this.gs.getError(error);
    //       alert(this.ErrorMessage);
    //     });
  }



}
