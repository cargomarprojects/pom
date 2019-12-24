
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


    constructor() { }

    ngOnInit() { }

    List(outputformat: string) {
        this.searchEvents.emit({ outputformat: outputformat, searchQuery: this.query });
      }
      
}