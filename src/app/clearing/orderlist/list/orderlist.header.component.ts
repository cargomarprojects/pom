
import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { SearchQuery } from '../../models/joborder';
import { SearchTable } from 'src/app/shared/models/searchtable';

@Component({
  selector: 'app-orderlist-header',
  templateUrl: 'orderlist.header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OrderListHeaderComponent implements OnInit {

  @Input() query : SearchQuery;

  @Output() searchEvents = new EventEmitter<any>();

  SortList: any[];

  where_agent = "CUST_IS_AGENT = 'Y'";
  where_shipper = "CUST_IS_SHIPPER = 'Y'";
  where_consignee = "CUST_IS_CONSIGNEE = 'Y'";

  constructor() { }

  ngOnInit() {
    this.SortList = [
      { "colheadername": "CREATED", "colname": "a.rec_created_date desc" },
      { "colheadername": "AGENT,SHIPPER,PO", "colname": "agent.cust_name,exp.cust_name,ord_po" }
    ];
  }

  List(outputformat: string) {
    this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.query });
  }

  LovSelected(_Record: SearchTable ) {
    // Company Settings
    console.log(_Record);
    if (_Record.controlname == "SHIPPER") {
      this.query.list_exp_id = _Record.id;
      this.query.list_exp_name = _Record.name;
    }
    if (_Record.controlname == "CONSIGNEE") {
      this.query.list_imp_id = _Record.id;
      this.query.list_imp_name = _Record.name;
    }
    if (_Record.controlname == "AGENT") {
      this.query.list_agent_id = _Record.id;
      this.query.list_agent_name = _Record.name;
      
    }
  }

}