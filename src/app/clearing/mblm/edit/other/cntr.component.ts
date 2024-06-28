import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../core/services/global.service';
import { Containerm } from '../../../models/mblm';
import { CntrService } from '../../../services/cntr.service';
import { SearchTable } from '../../../../shared/models/searchtable';

@Component({
    selector: 'app-cntr',
    templateUrl: './cntr.component.html',
    providers: [CntrService]
})
export class CntrComponent {
    // Local Variables 
    title = 'Container List';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';
    @Input() RecordList: Containerm[] = [];
    
    modal: any;
    selectedId: string = '';
    loading = false;
    CntrTypes: string = "";

    private errorMessage: string[] = [];

    mode = 'ADD';
    pkid = '';
    ctr: number;



    // Array For Displaying List
    
    // Single Record for add/edit/view details
    Record: Containerm = new Containerm;

    constructor(
        private ms: CntrService,
        private route: ActivatedRoute,
        private gs: GlobalService,
        private modalService: NgbModal,
    ) {
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        // this.List('NEW');
        this.ActionHandler("ADD", null);
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    LoadDefault() {

        // this.loading = true;
        // let SearchData = {
        //   pkid: this.parentid,
        //   comp_code: this.gs.globalVariables.comp_code,
        //   branch_code: this.gs.globalVariables.branch_code,

        // };

        // this.ErrorMessage = '';
        // this.InfoMessage = '';
        // this.ms.LoadDefault(SearchData)
        //   .subscribe(response => {
        //     this.loading = false;
        //   },
        //     error => {
        //       this.loading = false;
        //       this.ErrorMessage = this.gs.getError(error);
        //       alert(this.ErrorMessage);
        //     });

    }


    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "CNTR-TYPE") {
            this.Record.cntr_type_id = _Record.id;
            this.Record.cntr_type_code = _Record.code;
        }

    }



    //function for handling LIST/NEW/EDIT Buttons
    ActionHandler(action: string, id: string) {
        this.errorMessage = [];
        if (action == 'LIST') {
            this.mode = '';
            this.pkid = '';
        }
        else if (action === 'ADD') {
            this.mode = 'ADD';
            this.ResetControls();
            this.NewRecord();
        }
        else if (action === 'EDIT') {
            this.mode = 'EDIT';
            this.ResetControls();
            this.pkid = id;
            this.GetRecord(id);
        }

    }


    ResetControls() {

    }

    List(_type: string) {
        // this.loading = true;
        // let SearchData = {
        //     type: _type,
        //     rowtype: this.type,
        //     parentid: this.parentid,
        //     company_code: this.gs.globalVariables.comp_code,
        //     branch_code: this.gs.globalVariables.branch_code,
        //     year_code: this.gs.globalVariables.year_code
        // };
        // this.errorMessage = [];
        // this.ms.List(SearchData)
        //     .subscribe(response => {
        //         this.loading = false;
        //         this.RecordList = response.list;
        //         this.ActionHandler("ADD", null);
        //     },
        //         error => {
        //             this.loading = false;
        //             this.errorMessage.push(this.gs.getError(error));
        //             this.gs.showToastScreen(this.errorMessage);
        //         });
    }

    NewRecord() {

        this.pkid = this.gs.getGuid();
        this.Record = new Containerm();
        this.Record.cntr_pkid = this.pkid;
        this.Record.cntr_mbl_id = this.parentid;
        this.Record.cntr_no = '';
        this.Record.cntr_type_id = '';
        this.Record.cntr_type_code = '';
        this.Record.rec_mode = this.mode;
        this.Record.rec_version = 0;
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

    LoadData(_Record: Containerm) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
    }
    // Save Data
    Save() {

        if (!this.allvalid())
            return;
        this.loading = true;
        this.errorMessage = [];

        this.Record.rec_category = this.type;
        this.Record._globalvariables = this.gs.globalVariables;
        this.ms.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.Record.rec_version = response.version;
                this.errorMessage.push("Save Complete");
                this.RefreshList();
                this.ActionHandler("ADD", null);
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

        if (this.Record.cntr_no.length <= 0) {
            bret = false;
            this.errorMessage.push("Container No Cannot Be Blank");
        }
        if (this.Record.cntr_type_id.length <= 0) {
            bret = false;
            this.errorMessage.push("Container Type Cannot Be Blank");
        }

        if (bret === false) {
            this.gs.showToastScreen(this.errorMessage);
        }
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.cntr_pkid == this.Record.cntr_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.cntr_no = this.Record.cntr_no;
            REC.cntr_type_code = this.Record.cntr_type_code;
        }
    }

    selectRowId(id: string) {
        this.selectedId = id;
    }
    getRowId() {
        return this.selectedId;
    }


    RemoveRecord(Id: string) {
        this.loading = true;
        let SearchData = {
            pkid: Id,
            parentid: this.parentid
        };
        this.errorMessage = [];
        
        this.ms.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList.splice(this.RecordList.findIndex(rec => rec.cntr_pkid == Id), 1);
                this.ActionHandler('ADD', null);
            },
                error => {
                    this.loading = false;
                    this.errorMessage.push(this.gs.getError(error));
                    this.gs.showToastScreen(this.errorMessage);
                });
    }


    Close() {
        this.gs.ClosePage('home');
    }

    OnBlur(field: string) {
        switch (field) {
            case 'cntr_no': {
                this.Record.cntr_no = this.Record.cntr_no.toUpperCase();
                break;
            }
        }
    }

}



