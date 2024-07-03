import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../core/services/global.service';
import { Containerd } from '../../models/mblm';
import { PlanHouseLink } from '../../models/planhouselink';
import { LinkOrdHblCntrService } from '../../services/linkordhblcntr.service';
import { SearchTable } from '../../../shared/models/searchtable';

@Component({
    selector: 'app-link-ord-hbl-cntr',
    templateUrl: './link-ord-hbl-cntr.component.html',
    providers: [LinkOrdHblCntrService]
})
export class LinkOrdHblCntrComponent {
    // Local Variables 
    title = 'Mapping List';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() mblid: string = '';
    @Input() planid: string = '';
    @Input() orderid: string = '';
    @Output() closeModalWindow = new EventEmitter<any>();

    modal: any;
    selectedId: string = '';
    loading = false;
    CntrTypes: string = "";
    cntrd_selected = false;
    chkselected = false;
    private errorMessage: string[] = [];

    mode = 'ADD';
    pkid = '';
    ctr: number;

    // Array For Displaying List
    RecordList: Containerd[] = [];
    // Single Record for add/edit/view details
    Record: PlanHouseLink = new PlanHouseLink;

    constructor(
        private ms: LinkOrdHblCntrService,
        private route: ActivatedRoute,
        private gs: GlobalService,
        private modalService: NgbModal,
    ) {
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.List('NEW');
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }


    List(_type: string) {
        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            mblid: this.mblid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            year_code: this.gs.globalVariables.year_code
        };
        this.errorMessage = [];
        this.ms.List(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
            },
                error => {
                    this.loading = false;
                    this.errorMessage.push(this.gs.getError(error));
                    this.gs.showToastScreen(this.errorMessage);
                });
    }

    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
        this.loading = true;
        let SearchData = {
            pkid: Id,
        };
        this.errorMessage = [];
        this.ms.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.LoadData(response.record);
            },
                error => {
                    this.loading = false;
                    this.errorMessage.push(this.gs.getError(error));
                    this.gs.showToastScreen(this.errorMessage);
                });
    }

    LoadData(_Record: PlanHouseLink) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
    }

    // Save Data
    Save() {

        if (!this.allvalid())
            return;
        this.loading = true;
        this.errorMessage = [];
        this.Record = new PlanHouseLink();
        this.Record.phl_plan_id = this.planid;
        this.Record.phl_ord_id = this.orderid;
        this.Record.linklist = this.RecordList;
        this.Record.rec_category = this.type;
        this.Record._globalvariables = this.gs.globalVariables;

        this.ms.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                //this.errorMessage.push("Save Complete");
                this.closeModalWindow.emit({ saction: 'SAVE' });
            },
                error => {
                    this.loading = false;
                    this.errorMessage.push(this.gs.getError(error));
                    this.gs.showToastScreen(this.errorMessage);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.errorMessage = [];
        let bOk: boolean = false;
        for (let rec of this.RecordList) {
            if (rec.cntrd_selected) {
                bOk = true;
                break;
            }
        }

        if (!bOk) {
            bret = false;
            this.errorMessage.push("No details found");
        }

        if (bret === false) {
            this.gs.showToastScreen(this.errorMessage);
        }
        return bret;
    }

    selectRowId(id: string) {
        this.selectedId = id;
    }
    getRowId() {
        return this.selectedId;
    }


    Close() {
        this.closeModalWindow.emit({ saction: 'CLOSE' });
    }

    OnBlur(field: string) {
        switch (field) {
            case 'cntr_no': {
                // this.Record.cntr_no = this.Record.cntr_no.toUpperCase();
                break;
            }
        }
    }

    SelectDeselect() {
        this.chkselected = !this.chkselected;
        for (let rec of this.RecordList) {
            rec.cntrd_selected = this.chkselected;
        }
    }

    ResetChkBox(_rec: Containerd) {
        _rec.cntrd_selected = !_rec.cntrd_selected;
    }
}



