import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../core/services/global.service';
import { Containerm } from '../../models/Container';
import { ContainerService } from '../../services/container.service';
import { SearchTable } from '../../../shared/models/searchtable';
import { DateComponent } from '../../../shared/date/date.component';
import { Location } from '@angular/common';

@Component({
    selector: 'app-container-edit',
    templateUrl: './container-edit.component.html'
})
export class ContainerEditComponent {

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() mode: string = '';
    @Input() pkid: string = '';

    InitCompleted: boolean = false;
    menu_record: any;
    title: '';

    bChanged: boolean;
    disableSave = true;
    loading = false;

    bPrint: boolean = false;
    searchstring = '';
    public sWhere = "";
    selectedId = "";
    urlid: string;
    lock_record: boolean = false;
    errorMessage: string[] = [];
    Record: Containerm = <Containerm>{};

    constructor(
        private modalService: NgbModal,
        public ms: ContainerService,
        private route: ActivatedRoute,
        public gs: GlobalService
    ) {
        const data = this.route.snapshot.queryParams;
        if (data != null) {
            this.InitCompleted = true;
            this.menuid = data.menuid;
            this.type = data.type;
            this.mode = data.mode;
            this.pkid = data.pkid;
            this.InitComponent();
        }
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.ActionHandler();
    }
    InitComponent() {
        this.bPrint = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_print)
                this.bPrint = true;
        }
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {
        // this.sub.unsubscribe();
    }

    selectRowId(id: string) {
        this.selectedId = id;
    }
    getRowId() {
        return this.selectedId;
    }

    LovSelected(_Record: SearchTable) {
        if (_Record.controlname == "CNTR-TYPE") {
            this.Record.cntr_type_id = _Record.id;
            this.Record.cntr_type_code = _Record.code;
        } else if (_Record.controlname == "CARRIER") {
            this.Record.cntr_carrier_id = _Record.id;
            this.Record.cntr_carrier_name = _Record.name;
            this.Record.cntr_carrier_code = _Record.code;
        }

    }

    ActionHandler() {
        this.errorMessage = [];
        if (this.mode === 'ADD') {
            this.resetControls();
            this.newRecord();
        }
        else if (this.mode === 'EDIT') {
            this.resetControls();
            this.getRecord(this.pkid);
        }
    }

    newRecord() {
        this.pkid = this.gs.getGuid();
        this.Record = new Containerm;
        this.Record.cntr_pkid = this.pkid;
        this.Record.cntr_seal_no = '';
        this.Record.cntr_no = '';
        this.Record.cntr_type_id = '';
        this.Record.cntr_type_code = '';
        this.Record.cntr_carrier_id = '';
        this.Record.cntr_carrier_code = '';
        this.Record.cntr_carrier_name = '';
        this.Record.cntr_booking_no = '';
        this.Record.rec_mode = this.mode;
        this.Record.rec_version = 0;
    }

    resetControls() {
        this.disableSave = true;
        if (!this.menu_record)
            return;

        if (this.menu_record.rights_admin)
            this.disableSave = false;
        if (this.mode == "ADD" && this.menu_record.rights_add)
            this.disableSave = false;
        if (this.mode == "EDIT" && this.menu_record.rights_edit)
            this.disableSave = false;

        return this.disableSave;
    }


    // Load a single Record for VIEW/EDIT
    getRecord(Id: string, _type: string = "") {
        this.loading = true;
        let SearchData = {
            pkid: Id,
            type: _type,
            report_folder: this.gs.globalVariables.report_folder,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code
        };
        this.errorMessage = [];
        this.ms.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.LoadData(response.record);
                }
            },
                error => {
                    this.loading = false;
                    this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
                    this.gs.showToastScreen(this.errorMessage);
                    this.mode = 'ADD';
                    this.ActionHandler();
                });
    }

    LoadData(_Record: Containerm) {
        this.Record = _Record;
        this.Record.rec_mode = this.mode;
    }

    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }
    // Save Data
    Save() {

        if (!this.allvalid())
            return;
        this.loading = true;
        this.errorMessage = [];
        this.Record._globalvariables = this.gs.globalVariables;
        this.ms.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                if (this.mode == 'ADD') {
                    this.Record.cntr_slno = response.slno;
                }
                this.mode = 'EDIT';
                this.Record.rec_mode = this.mode;
                this.Record.rec_version = response.version;
                this.ms.RefreshList(this.Record);
                this.gs.showToastScreen(['Save Complete']);
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

        if (this.Record.cntr_no.trim().length <= 0) {
            bret = false;
            this.errorMessage.push("Container Cannot Be Blank");
        }

        if (bret === false) {
            this.gs.showToastScreen(this.errorMessage);
        }

        return bret;
    }

    OnChange(field: string) {

    }


    OnBlur(field: string) {
        switch (field) {
            case 'cntr_asealno':
                {
                    this.Record.cntr_asealno = this.Record.cntr_asealno.toUpperCase();
                    break;
                }
        }
    }


    Close() {
        this.gs.ClosePage('home');
    }


}
