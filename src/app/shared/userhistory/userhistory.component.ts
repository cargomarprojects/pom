import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../core/services/global.service';
import { SearchTable } from '../../shared/models/searchtable';
import { UserHistory } from '../../shared/models/userhistory';

@Component({
    selector: 'app-userhistory',
    templateUrl: './userhistory.component.html'
})
export class UserHistoryComponent {
    title = 'History Details';
    @Input() public pkid: string = '';
    @Input() public type: string = '';
    @Input() public subid: string = '';
    InitCompleted: boolean = false;
    disableSave = true;
    loading = false;
    currentTab = 'LIST';
    page_count: 0;
    page_current: 0;
    page_rows: 25;
    page_rowcount: 0;
    selectedId: string = "";
    sub: any;
    urlid: string;
    ErrorMessage = "";
    InfoMessage = "";
    RecordList: UserHistory[] = [];

    constructor(
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 25;
        this.page_current = 0;
    }
    // Init Will be called After executing Constructor
    ngOnInit() {
        this.List("NEW");
    }
    public selectRowId(id: string) {
        this.selectedId = id;
    }
    public getRowId() {
        return this.selectedId;
    }

    List(_type: string) {
        this.InfoMessage = '';
        this.ErrorMessage = '';
        if (this.pkid.trim().length <= 0 && this.subid.trim().length <= 0) {
            this.ErrorMessage = "Invalid ID";
            alert(this.ErrorMessage);
            return;
        }
        /*     
        if (this.type.trim().length <= 0) {
           this.ErrorMessage = "Invalid Type";
          return;
        }*/

        this.loading = true;
        let SearchData = {
            table: 'userhistory',
            type: _type,
            pkid: this.pkid,
            subid: this.subid,
            rowtype: this.type,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            page_count: this.page_count,
            page_current: this.page_current,
            page_rows: this.page_rows,
            page_rowcount: this.page_rowcount
        };
        this.gs.SearchRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.InfoMessage = '';
                this.RecordList = response.list;
                this.page_count = response.page_count;
                this.page_current = response.page_current;
                this.page_rowcount = response.page_rowcount;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                    alert(this.ErrorMessage);
                });
    }
}
