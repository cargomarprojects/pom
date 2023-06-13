import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { POSettingService } from '../services/po-setting.service';
import { SearchTable } from '../../shared/models/searchtable';
import { PO_Settings, PO_Settings_VM } from '../models/po-setting';


@Component({
    selector: 'app-po-setting',
    templateUrl: './po-setting.component.html',
    providers: [POSettingService]
})
export class PoSettingComponent {
    // Local Variables 
    title = 'PO Setting';
    loading = false;
    currentTab = 'LIST';

    grp_id: string = '';
    grp_name: string = '';

    searchstring = '';
    page_count = 0;
    page_current = 0;
    page_rows = 0;
    page_rowcount = 0;

    sub: any;
    urlid: string;

    data_list = [];

    ErrorMessage = "Group Details";

    mode = '';
    pkid = '';

    cust_id = '';
    cust_code = '';
    cust_name = '';

    Record: PO_Settings_VM;
    RecordList: PO_Settings[] = [];


    constructor(
        private mainService: POSettingService,
        private location: Location,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 50;
        this.page_current = 0;

        const data = this.route.snapshot.queryParams;

        this.grp_id = data.grp_id;
        this.grp_name = data.grp_name;

        this.title = 'PO Settings - ' + this.grp_name;

        this.GetRecord(this.grp_id);

    }

    // Init Will be called After executing Constructor
    ngOnInit() {

    }
    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    InitLov() {
    }

    LovSelected(_Record: SearchTable) {

        if (_Record.controlname == "CUSTOMER") {
            this.cust_id = _Record.id;
            this.cust_code = _Record.code;
            this.cust_name = _Record.name;
        }
    }


    // Load a single Record for VIEW/EDIT
    GetRecord(Id: string) {
        this.loading = true;

        let SearchData = {
            pkid: Id,
            comp_id: this.gs.globalVariables.comp_pkid
        };

        this.ErrorMessage = '';
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordList = response.list;
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }

    // Save Data
    Save() {

        if (!this.allvalid())
            return;
        this.loading = true;
        this.ErrorMessage = '';

        this.Record = new PO_Settings_VM();
        this.Record.po_settings_list = this.RecordList;
        this.Record.grp_id = this.grp_id;
        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.mode = 'EDIT';
                alert('Save Complete')
            },
                error => {
                    this.loading = false;
                    alert(this.gs.getError(error));
                });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';

        if (this.gs.isBlank(this.grp_id)) {
            alert('Invalid Customer Group');
            return false;
        }

        if (!bret)
            this.ErrorMessage = sError;
        return bret;
    }


    Close() {
        this.gs.ClosePage('home');
    }
     

}
