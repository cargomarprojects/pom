import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../../core/services/global.service';
import { UserHistory } from '../../../../shared/models/userhistory';
import { Joborderm } from '../../../models/joborder';
import { Tracking_Caption } from '../../../models/tracking_caption';
import { OrderListService } from '../../../services/orderlist.service';

@Component({
    selector: 'app-trkevent',
    templateUrl: './trkevent.component.html'
})
export class TrkEventComponent {
    title = 'Tracking Event Details';
    @Input() public pkid: string = '';
    @Input() public type: string = '';
    @Input() public subid: string = '';
    @Input() public filterList: any[] = [];
    @Input() public RecordList: UserHistory[] = [];
    @Input() public trkRec: Joborderm = <Joborderm>{};
    
    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    // page_count: 0;
    // page_current: 0;
    // page_rows: 100;
    // page_rowcount: 0;
    selectedId: string = "";
    sub: any;
    urlid: string;
    ErrorMessage = "";
    InfoMessage = "";
    history_type = "NA";



    constructor(
        private route: ActivatedRoute,
        public gs: GlobalService
    ) {
        // this.page_count = 0;
        // this.page_rows = 100;
        // this.page_current = 0;
    }
    // Init Will be called After executing Constructor
    ngOnInit() {

    }
    public selectRowId(id: string) {
        this.selectedId = id;
    }
    public getRowId() {
        return this.selectedId;
    }

}
