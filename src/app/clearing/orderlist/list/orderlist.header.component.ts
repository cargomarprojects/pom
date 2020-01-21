import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SearchQuery } from '../../models/joborder';
import { SearchTable } from 'src/app/shared/models/searchtable';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { SelectSelectedRecordsCount, SelectSelectedPkidsPos } from './store/orderlist.selctors';
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

  modalRef: any;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private gs: GlobalService,
    private modalService: NgbModal,
  ) {
    this.selectedRecordsCount$ = this.store.pipe(
      select(SelectSelectedRecordsCount),
      tap(total => this.total = total)
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

  tracking(modalname: any) {
    if (this.total <= 0) {
      alert('No Rows Selected');
      return;
    }
    this.modalRef = this.modalService.open(modalname, { centered: true });
    /*
        var urlid = this.gs.getParameter('urlid');
        let parameter = {
          urlid: urlid,
          type: '',
          origin: 'orderlist',
        };
        this.router.navigate(['clearing/tracking'], { queryParams: parameter });
    */

  }



  MailOrders(_filetype: string = "") {
  }


  changeStatus(modalname: any) {
    if (this.total <= 0) {
      alert('No Rows Selected');
      return;
    }
    this.modalRef = this.modalService.open(modalname, { centered: true });
  }

  closeModal() {
    this.modalRef.close();
  }

}
