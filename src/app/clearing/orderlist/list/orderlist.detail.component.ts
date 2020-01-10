import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { Joborderm } from '../../models/joborder';

@Component({
  selector: 'app-orderlist-detail',
  templateUrl: 'orderlist.detail.component.html',
})

export class OrderListDetailComponent implements OnInit {

  private records : Joborderm[];
  @Input() set _records( value : Joborderm[]){
    
    this.records = [...value];
    //this.records = JSON.parse(JSON.stringify(value));

  }

  constructor() { }
  
  ngOnInit() {
  }

}
