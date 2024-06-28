import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blm,Containerd, SearchQuery, BlmModel } from '../models/mblm';
import { GlobalService } from '../../core/services/global.service';
import { Blm_VM,Containerm } from '../models/mblm';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class MblmListService {

    title = 'MASTER LIST';
    menuid: string = '';
    type: string = '';

    public initlialized = false;
    private appid = ''
    public canDelete: boolean;
    menu_record: any;
    total = 0;
    ErrorMessage = "";
    InfoMessage = "";
    loading = false;
    //   where_buy_agent = "CUST_IS_BUY_AGENT = 'Y'";
    modalRef: any;

    private _record: BlmModel;

    constructor(
        private modalService: NgbModal,
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

    ReadUserRights() {
        this.canDelete = false;
        this.menu_record = this.gs.getMenu(this.menuid);
        if (this.menu_record) {
            this.title = this.menu_record.menu_name;
            if (this.menu_record.rights_delete)
                this.canDelete = true;
        }
    }

    initDefaultValues() {
        this.total = 0;
        this.record = <BlmModel>{
            urlid: '',
            selectedId: '',
            message: '',
            isError: false,
            records: [],
            searchQuery: <SearchQuery>{
                branch_code: this.gs.globalVariables.branch_code,
                company_code: this.gs.globalVariables.user_company_code,
                user_code: this.gs.globalVariables.user_code,
                page_count: 0,
                page_current: 0,
                page_rows: 20,
                page_rowcount: 0,
                searchstring: '',
                file_pkid: '',
                report_folder: '',

            }
        };
    }


    public selectRowId(id: string) {
        this._record.selectedId = id;
    }
    public getRowId() {
        return this._record.selectedId;
    }

    LoadCombo() {

    }

    List(_type: string) {
        this.total = 0;
        this.loading = true;
        let SearchData = {
            type: _type,
            rowtype: this.type,
            searchstring: this._record.searchQuery.searchstring,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code,
            page_count: this._record.searchQuery.page_count,
            page_current: this._record.searchQuery.page_current,
            page_rows: this._record.searchQuery.page_rows,
            page_rowcount: this._record.searchQuery.page_rowcount,
            report_folder: this.gs.globalVariables.report_folder,
            file_pkid: this.gs.getGuid()
        };
        this.ErrorMessage = '';
        this.InfoMessage = '';
        this.MblList(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (_type == 'EXCEL')
                    this.Downloadfile(response.filename, response.filetype, response.filedisplayname);
                else {
                    this.record.records = response.list;
                    this.record.searchQuery.page_count = response.page_count;
                    this.record.searchQuery.page_current = response.page_current;
                    this.record.searchQuery.page_rowcount = response.page_rowcount;
                }
            },
                error => {
                    this.loading = false;
                    this.ErrorMessage = this.gs.getError(error);
                });
    }
    Downloadfile(filename: string, filetype: string, filedisplayname: string) {
        this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
    }

    RefreshList(_record: Blm) {
        if (this.record.records == null)
            return;

        var REC = this.record.records.find(rec => rec.bl_pkid == _record.bl_pkid);
        if (REC == null) {
            this.record.records.push(_record);
        }
        else {
            REC.bl_date = _record.bl_date;
            // REC.ord_agent_name = _rec.ord_agent_name;
            // REC.ord_exp_name = _rec.ord_exp_name;
            // REC.ord_imp_name = _rec.ord_imp_name;
            // REC.ord_buy_agent_name = _rec.ord_buy_agent_name;
            // REC.ord_pod_agent_name = _rec.ord_pod_agent_name;
            // REC.ord_pol = _rec.ord_pol;
            // REC.ord_pod = _rec.ord_pod;
        }

    }


    DeleteRow(_rec: Blm) {

        if (!confirm("DELETE " + _rec.bl_no)) {
            return;
        }
        this.loading = true;
        let SearchData = {
            pkid: _rec.bl_pkid,
            company_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
            user_code: this.gs.globalVariables.user_code
        };
        this.ErrorMessage = '';
        this.InfoMessage = '';

        this.DeleteRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                if (response.retvalue == false) {
                    this.ErrorMessage = response.error;
                    alert(this.ErrorMessage);
                }
                else {
                    this.record.records.splice(this.record.records.findIndex(rec => rec.bl_pkid == _rec.bl_pkid), 1);
                }

            }, error => {
                this.loading = false;
                this.ErrorMessage = this.gs.getError(error);
                alert(this.ErrorMessage);
            });
    }

    MblList(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/MblmList/List', SearchData, this.gs.headerparam2('authorized'));
    }

    GetRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/MblmList/GetRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Blm) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/MblmList/Save', Record, this.gs.headerparam2('authorized'));
    }

    DeleteRecord(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/MblmList/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
    }

    LoadDefault(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/MblmList/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
    }

    SaveLink(Record: Containerd) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/MblmList/SaveLink', Record, this.gs.headerparam2('authorized'));
    }

    GetRecordLink(SearchData: any) {
        return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/MblmList/GetRecordLink', SearchData, this.gs.headerparam2('authorized'));
    }
}





