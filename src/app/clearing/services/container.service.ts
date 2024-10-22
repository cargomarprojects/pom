
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Containerm, ContainerModel, SearchQuery } from '../models/Container';
import { GlobalService } from '../../core/services/global.service';

@Injectable({ providedIn: 'root' })
export class ContainerService {

    title = 'Container';
    menuid: string = '';
    type: string = '';

    public initlialized = false;
    private appid = ''

    menu_record: any;
    modal: any;

    disableSave = true;
    loading = false;
    public bAdmin = false;
    public bDelete = false;

    searchstring = '';
    public errorMessage: string[] = [];

    private _record: ContainerModel;

    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }
    public get record() {
        return this._record;
    }
    public set record(value: any) {
        this._record = value;
    }

    public init(params: any) {

        if (this.appid != this.gs.globalVariables.appid) {
            this.appid = this.gs.globalVariables.appid;
            this.initlialized = false;
        }
        if (this.initlialized)
            return;

        this.menuid = params.menuid;

        this.type = params.type;

        this.initDefaultValues();

        this.LoadCombo();

        this.ReadUserRights();

        this.List("NEW");

        this.initlialized = true;
    }

    initDefaultValues() {
        this.record = <ContainerModel>{
            urlid: '',
            selectedId: '',
            message: '',
            isError: false,
            records: [],
            searchQuery: <SearchQuery>{
                searchstring: '',
                company_code: this.gs.globalVariables.comp_code,
                branch_code: this.gs.globalVariables.branch_code,
                year_code: this.gs.globalVariables.year_code,
                user_code: this.gs.globalVariables.user_code,
                page_count: 0,
                page_current: 0,
                page_rows: 20,
                page_rowcount: 0
            }
        };
    }
    ReadUserRights() {
        this.bAdmin = false;
        this.bDelete = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_admin)
                this.bAdmin = true;
            if (this.menu_record.rights_delete)
                this.bDelete = true;
        }
    }

    public selectRowId(id: string) {
        this._record.selectedId = id;
    }
    public getRowId() {
        return this._record.selectedId;
    }

    LoadCombo() {

    }

    // Query List Data
    List(_type: string) {
        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this._record.searchQuery.searchstring.toUpperCase(),
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code,
            year_code: this.gs.globalVariables.year_code,
            page_count: this._record.searchQuery.page_count,
            page_current: this._record.searchQuery.page_current,
            page_rows: this._record.searchQuery.page_rows,
            page_rowcount: this._record.searchQuery.page_rowcount
        };

        this.errorMessage = [];
        this.ContainerList(SearchData)
            .subscribe(response => {
                this.loading = false;

                this.record.records = response.list;
                this.record.searchQuery.page_count = response.page_count;
                this.record.searchQuery.page_current = response.page_current;
                this.record.searchQuery.page_rowcount = response.page_rowcount;
            },
                error => {
                    this.loading = false;
                    this.errorMessage = this.gs.getErrorArray(this.gs.getError(error));
                    this.gs.showToastScreen(this.errorMessage)
                });
    }


    RefreshList(_rec: Containerm) {
        if (this.record.records == null)
            return;
        var REC = this.record.records.find(rec => rec.cntr_pkid == _rec.cntr_pkid);
        if (REC == null) {
            this.record.records.push(_rec);
        }
        else {
            REC.cntr_asealno = _rec.cntr_asealno;
            REC.cntr_no = _rec.cntr_no;
        }
    }

    ContainerList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Container/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Container/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Containerm) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Container/Save', Record, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Container/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }
}

