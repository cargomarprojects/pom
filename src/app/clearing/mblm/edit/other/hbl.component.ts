import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../core/services/global.service';
import { Blm } from '../../../models/mblm';
import { HblService } from '../../../services/hbl.service';
import { SearchTable } from '../../../../shared/models/searchtable';

@Component({
    selector: 'app-hbl',
    templateUrl: './hbl.component.html',
    providers: [HblService]
})
export class HblComponent {
    // Local Variables 
    title = 'House List';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() parentid: string = '';
    @Input() RecordList: Blm[] = [];

    modal: any;
    menu_record: any;
    selectedId: string = '';
    loading = false;
    bDocs: boolean = false;
    bDelete: boolean = false;
    docGroupId: string = '';
  

    private errorMessage: string[] = [];

    mode = 'ADD';
    pkid = '';
    ctr: number;

    // Array For Displaying List

    // Single Record for add/edit/view details
    Record: Blm = new Blm;

    constructor(
        private ms: HblService,
        private route: ActivatedRoute,
        public gs: GlobalService,
        private modalService: NgbModal,
    ) {

    }


    // Init Will be called After executing Constructor
    ngOnInit() {
        // this.List('NEW');
        this.InitComponent();
        this.ActionHandler("ADD", null);
    }

    InitComponent() {
        this.bDelete = false;
        this.bDocs = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_docs)
                this.bDocs = true;
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

        // if (_Record.controlname == "CNTR-TYPE") {
        //     this.Record.cntr_type_id = _Record.id;
        //     this.Record.cntr_type_code = _Record.code;
        // }

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
        this.Record = new Blm();
        this.Record.bl_pkid = this.pkid;
        this.Record.bl_mbl_id = this.parentid;
        this.Record.bl_no = '';
        this.Record.bl_date = '';
        this.Record.bl_slno = undefined;
        this.Record.bl_type = '';
        if (this.type == "SEA EXPORT")
            this.Record.bl_type = 'HBL-SE';
        else if (this.type == "AIR EXPORT")
            this.Record.bl_type = 'HBL-AE';
        this.Record.rec_category = this.type;
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

    LoadData(_Record: Blm) {
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
                // this.gs.showToastScreen(["Save Complete"]);
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

        if (this.Record.bl_no.length <= 0) {
            bret = false;
            this.errorMessage.push("House# Cannot Be Blank");
        }
        if (this.Record.bl_date.length <= 0) {
            bret = false;
            this.errorMessage.push("Date Cannot Be Blank");
        }

        if (bret === false) {
            this.gs.showToastScreen(this.errorMessage);
        }
        return bret;
    }

    RefreshList() {

        if (this.RecordList == null)
            return;
        var REC = this.RecordList.find(rec => rec.bl_pkid == this.Record.bl_pkid);
        if (REC == null) {
            this.RecordList.push(this.Record);
        }
        else {
            REC.bl_no = this.Record.bl_no;
            REC.bl_date = this.Record.bl_date;
        }
    }

    selectRowId(id: string) {
        this.selectedId = id;
    }
    getRowId() {
        return this.selectedId;
    }


    DeleteRow(_rec: Blm) {
        this.loading = true;
        let SearchData = {
            pkid: _rec.bl_pkid,
            mblid: _rec.bl_mbl_id,
            blno: _rec.bl_no,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code
        };
        this.errorMessage = [];
        this.ms.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (response.error) {
                    this.gs.showToastScreen([response.error]);
                } else {
                    this.RecordList.splice(this.RecordList.findIndex(rec => rec.bl_pkid == _rec.bl_pkid), 1);
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
                this.Record.bl_no = this.Record.bl_no.toUpperCase();
                break;
            }
        }
    }

    ShowDocuments(_id: string, doc: any) {
        this.docGroupId = _id;
        this.open(doc);
    }

    open(content: any) {
        this.modal = this.modalService.open(content, { backdrop: 'static', keyboard: true });
    }

    getWidth(_type: string) {
        let _width: any;

        if (_type == "DT-COL") {
            _width = '20%';
            if (!this.bDocs && !this.bDelete)
                _width = '70%';
            else if (this.bDocs && this.bDelete)
                _width = '20%';
        }
        if (_type == "DOC-COL") {
            _width = '10%';
            if (this.bDocs && this.bDelete)
                _width = '10%';
            else if (this.bDocs)
                _width = '50%';
        }
        if (_type == "DEL-COL") {
            _width = '40%';
            if (this.bDocs && this.bDelete)
                _width = '40%';
            else if (this.bDelete)
                _width = '50%';
        }

        return _width;
    }
}



