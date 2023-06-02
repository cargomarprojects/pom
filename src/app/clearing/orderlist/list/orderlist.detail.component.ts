import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { Joborderm } from '../../models/joborder';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { SelectDeselctRecord } from './store/orderlist.actions';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
  selector: 'app-orderlist-detail',
  templateUrl: 'orderlist.detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OrderListDetailComponent implements OnInit {

  records: Joborderm[];
  @Input() set _records(value: Joborderm[]) {
    this.records = JSON.parse(JSON.stringify(value));
  }

  @Output() EditRecord = new EventEmitter<any>();

  selectcheck = false;

  constructor(
    private store: Store<AppState>,
    private gs: GlobalService
  ) { }

  ngOnInit() {

  }

  GetCaptionCode(_type: string) {
    var REC = this.gs.trkCaptionList.find(rec => rec.trk_caption_code == _type);
    if (REC != null) {
      if (REC.trk_enabled)
        return REC.trk_caption_code;
      else
        return '';
    }
    else
      return '';
  }

  handleChange(rec: Joborderm) {
    var urlid = this.gs.getParameter('urlid');
    this.store.dispatch(SelectDeselctRecord({ urlid: urlid, pkid: rec.ord_pkid, ball: false, flag: rec.ord_selected }));
  }

  ActionHandler(action: string, id: string) {
    this.EditRecord.emit({ action: action, id: id });
  }

  SelectCheckbox(flag: boolean) {
    var urlid = this.gs.getParameter('urlid');
    this.store.dispatch(SelectDeselctRecord({ urlid: urlid, pkid: '', ball: true, flag: flag }));
  }

}
