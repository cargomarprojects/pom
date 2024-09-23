import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../../core/services/global.service';
import { Containerd } from '../../../../models/mblm';
import { LinkCntrHblService } from '../../../../services/linkcntrhbl.service';
import { SearchTable } from '../../../../../shared/models/searchtable';

@Component({
    selector: 'app-link-cntr-hbl',
    templateUrl: './link-cntr-hbl.component.html',
    providers: [LinkCntrHblService]
})
export class LinkCntrHblComponent {
    // Local Variables 
    title = 'Mapping List';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';
    @Input() RecordList: Containerd[] = [];

    modal: any;
    selectedId: string = '';
    loading = false;
    CntrTypes: string = "";
    menu_record: any;

    private errorMessage: string[] = [];

    mode = 'ADD';
    pkid = '';
    ctr: number;
    bDelete: boolean = false;


    // Array For Displaying List

    // Single Record for add/edit/view details
    Record: Containerd = new Containerd;

    constructor(
        private ms: LinkCntrHblService,
        private route: ActivatedRoute,
        private gs: GlobalService,
        private modalService: NgbModal,
    ) {
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.InitComponent();
        // this.List('NEW');
        this.ActionHandler("ADD", null);
    }

    InitComponent() {
        this.bDelete = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_delete)
                this.bDelete = true;
        }
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

        if (_Record.controlname == "CNTR-NO") {
            this.Record.cntrd_cntr_id = _Record.id;
            this.Record.cntrd_cntr_no = _Record.code;
        }
        if (_Record.controlname == "HOUSE-NO") {
            this.Record.cntrd_hbl_id = _Record.id;
            this.Record.cntrd_hbl_no = _Record.code;
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
        this.Record = new Containerd();
        this.Record.cntrd_pkid = this.pkid;
        this.Record.cntrd_mbl_id = this.parentid;
        this.Record.cntrd_cntr_id = '';
        this.Record.cntrd_cntr_no = '';
        this.Record.cntrd_hbl_id = '';
        this.Record.cntrd_hbl_no = '';
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
                    this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
                    this.gs.showToastScreen(this.errorMessage);
                });
    }

    LoadData(_Record: Containerd) {
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
                //this.errorMessage.push("Save Complete");
                this.RefreshList();
                this.ActionHandler("ADD", null);
            },
                error => {
                    this.loading = false;
                    this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
                    this.gs.showToastScreen(this.errorMessage);
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.errorMessage = [];

        if (this.Record.cntrd_cntr_id.length <= 0) {
            bret = false;
            this.errorMessage.push("Container No Cannot Be Blank");
        }
        if (this.Record.cntrd_hbl_id.length <= 0) {
            bret = false;
            this.errorMessage.push("House No Cannot Be Blank");
        }

        if (bret === false) {
            this.gs.showToastScreen(this.errorMessage);
        }
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.cntrd_pkid == this.Record.cntrd_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.cntrd_cntr_no = this.Record.cntrd_cntr_no;
            REC.cntrd_hbl_no = this.Record.cntrd_hbl_no;
        }
    }

    selectRowId(id: string) {
        this.selectedId = id;
    }
    getRowId() {
        return this.selectedId;
    }


    DeleteRow(_rec: Containerd) {
        this.errorMessage = [];
        if (!confirm("Delete selected row")) {
            return;
        }

        this.loading = true;
        let SearchData = {
            pkid: _rec.cntrd_pkid,
            mblid: _rec.cntrd_mbl_id,
            cntrno: _rec.cntrd_cntr_no,
            blno: _rec.cntrd_hbl_no,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code
        };
        this.errorMessage = [];

        this.ms.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (response.error) {
                    this.errorMessage = this.gs.getErrorArray(response.error);
                    this.gs.showToastScreen(this.errorMessage);
                } else {
                    this.RecordList.splice(this.RecordList.findIndex(rec => rec.cntrd_pkid == _rec.cntrd_pkid), 1);
                    this.ActionHandler('ADD', null);
                }
            },
                error => {
                    this.loading = false;
                    this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
                    this.gs.showToastScreen(this.errorMessage);
                });
    }


    Close() {
        this.gs.ClosePage('home');
    }

    OnBlur(field: string) {
        switch (field) {
            case 'cntr_no': {
                // this.Record.cntr_no = this.Record.cntr_no.toUpperCase();
                break;
            }
        }
    }

}



