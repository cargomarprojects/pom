import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { Joborderm } from '../../models/joborder';

@Component({
  selector: 'app-orderlist-detail',
  templateUrl: 'orderlist.detail.component.html',
  changeDetection : ChangeDetectionStrategy.OnPush
})

export class OrderListDetailComponent implements OnInit {

  records : Joborderm[];
  @Input() set _records( value : Joborderm[]){
    this.records  = [...value];
  }

  constructor() { }
  
  ngOnInit() {
  }


}
