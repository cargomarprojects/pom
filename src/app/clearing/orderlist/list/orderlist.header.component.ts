
import { Component, OnInit, Input, Output, EventEmitter,SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { SearchQuery } from '../../models/joborder';

@Component({
    selector: 'app-orderlist-header',
    templateUrl: 'orderlist.header.component.html',
    changeDetection : ChangeDetectionStrategy.OnPush
})

export class OrderListHeaderComponent implements OnInit {

    query : SearchQuery;
    @Input() set _query( value : SearchQuery){
      this.query  = Object.assign({}, value);
    }
    
    @Output() searchEvents = new EventEmitter<any>();

    SortList : any [];


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
      
}