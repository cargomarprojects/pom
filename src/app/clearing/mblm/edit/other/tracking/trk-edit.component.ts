import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../../core/services/global.service';
import { Blm } from '../../../../models/mblm';
import { TrkService } from '../../../../services/trk.service';
import { SearchTable } from '../../../../../shared/models/searchtable';
import { Trackingm } from '../../../../models/tracking';

@Component({
    selector: 'app-trk-edit',
    templateUrl: './trk-edit.component.html',
    providers: [TrkService]
})
export class TrkEditComponent {
    // Local Variables 
    title = 'Tracking List';

    @Input() menuid: string = '';
    @Input() type: string = '';
    @Input() mode: string = 'ADD';
    @Input() pkid: string = '';
    @Output() closeModalWindow = new EventEmitter<any>();
    modal: any;
    selectedId: string = '';
    loading = false;
    CntrTypes: string = "";

    private errorMessage: string[] = [];
    ctr: number;
    // Array For Displaying List

    // Single Record for add/edit/view details
    Record: Blm = new Blm;

    constructor(
        private ms: TrkService,
        private route: ActivatedRoute,
        private gs: GlobalService,
        private modalService: NgbModal,
    ) {
    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        // this.List('NEW');
        this.ActionHandler(this.mode, this.pkid);
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

        if (_Record.controlname == "POL") {
            this.Record.bl_pol_id = _Record.id;
            this.Record.bl_pol_code = _Record.code;
            this.Record.bl_pol_name = _Record.name;
        }
        if (_Record.controlname == "VESSEL") {
            this.Record.bl_vessel_id = _Record.id;
            this.Record.bl_vessel_code = _Record.code;
            this.Record.bl_vessel_name = _Record.name;
        }
        if (_Record.controlname == "POD") {
            this.Record.bl_pod_id = _Record.id;
            this.Record.bl_pod_code = _Record.code;
            this.Record.bl_pod_name = _Record.name;
        }
        if (_Record.controlname == "POFD") {
            this.Record.bl_pofd_id = _Record.id;
            this.Record.bl_pofd_code = _Record.code;
            this.Record.bl_pofd_name = _Record.name;
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
        this.Record = new Blm();
        this.Record.bl_pkid = this.pkid;
        this.Record.bl_pol_id = '';
        this.Record.bl_pol_code = '';
        this.Record.bl_pol_name = '';
        this.Record.bl_pod_id = '';
        this.Record.bl_pod_code = '';
        this.Record.bl_pod_name = '';
        this.Record.bl_pofd_id = '';
        this.Record.bl_pofd_code = '';
        this.Record.bl_pofd_name = '';
        this.Record.bl_vessel_id = '';
        this.Record.bl_vessel_code = '';
        this.Record.bl_vessel_name = '';
        this.Record.bl_vessel_no = '';
        this.Record.bl_pol_etd = '';
        this.Record.bl_pol_eta = '';
        this.Record.bl_pod_eta = '';
        this.Record.bl_pofd_eta = '';
        this.Record.bl_pol_etd_confirm = false;
        this.Record.bl_pol_eta_confirm = false;
        this.Record.bl_pod_eta_confirm = false;
        this.Record.bl_pofd_eta_confirm = false;
        this.Record.bl_si_cutoff = '';
        this.Record.bl_cy_cutoff = '';
        this.Record.bl_track_comments = '';
        this.Record.TransitList = new Array<Trackingm>();
        this.Record.rec_mode = this.mode;
        this.Record.rec_version = 0;
        this.NewTransitRecord();
    }

    NewTransitRecord() {
        let Rec: Trackingm = new Trackingm;
        Rec.trk_pkid = this.gs.getGuid();
        Rec.trk_parent_id = this.Record.bl_pkid;
        Rec.rec_category = this.type;
        Rec.trk_vsl_id = '';
        Rec.trk_vsl_code = '';
        Rec.trk_vsl_name = '';
        Rec.trk_voyage = '';
        Rec.trk_pol_id = '';
        Rec.trk_pol_code = '';
        Rec.trk_pol_name = '';
        Rec.trk_pol_etd = '';
        Rec.trk_pol_etd_confirm = false;
        Rec.trk_pod_id = '';
        Rec.trk_pod_code = '';
        Rec.trk_pod_name = '';
        Rec.trk_pod_eta = '';
        Rec.trk_pod_eta_confirm = false;
        Rec.trk_vsl_count = 0;
        Rec.trk_si_cutoff = '';
        Rec.trk_cy_cutoff = '';
        Rec.row_colour = 'darkslategray';
        this.Record.TransitList.push(Rec);
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
        if (this.Record.TransitList.length == 0)
            this.NewTransitRecord();
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
                // this.RefreshList();
                // this.ActionHandler("ADD", null);
                this.closeModalWindow.emit({ saction: 'SAVE', list: response.tracklist });
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

        if (this.Record.bl_vessel_id.trim().length <= 0) {
            bret = false;
            this.errorMessage.push("Vessel Cannot Be Blank");
        }
        if (this.Record.bl_pol_id.trim().length <= 0) {
            bret = false;
            this.errorMessage.push("POL Cannot Be Blank");
        }
        if (this.Record.bl_pol_etd.trim().length <= 0) {
            bret = false;
            this.errorMessage.push("ETD Cannot Be Blank");
        }
        if (this.Record.bl_pod_id.trim().length <= 0) {
            bret = false;
            this.errorMessage.push("POD Cannot Be Blank");
        }
        if (this.Record.bl_pod_eta.trim().length <= 0) {
            bret = false;
            this.errorMessage.push("ETA Cannot Be Blank");
        }
        if (this.Record.bl_pofd_id.trim().length <= 0) {
            bret = false;
            this.errorMessage.push("POFD Cannot Be Blank");
        }
        if (this.Record.bl_pofd_eta.trim().length <= 0) {
            bret = false;
            this.errorMessage.push("POFD ETA Cannot Be Blank");
        }

        if (bret === false) {
            this.gs.showToastScreen(this.errorMessage);
        }
        return bret;
    }

    RefreshList() {

        // if (this.RecordList == null)
        //     return;
        // var REC = this.RecordList.find(rec => rec.cntr_pkid == this.Record.cntr_pkid);
        // if (REC == null) {
        //     this.RecordList.push(this.Record);
        // }
        // else {
        //     REC.cntr_no = this.Record.cntr_no;
        //     REC.cntr_type_code = this.Record.cntr_type_code;
        // }
    }

    selectRowId(id: string) {
        this.selectedId = id;
    }
    getRowId() {
        return this.selectedId;
    }

    Close() {
        // this.gs.ClosePage('home');
        this.closeModalWindow.emit({ saction: 'CLOSE' });
    }

    OnBlur(field: string) {
        switch (field) {
            case 'bl_vessel_no': {
                this.Record.bl_vessel_no = this.Record.bl_vessel_no.toUpperCase();
                break;
            }
            case 'bl_track_comments': {
                this.Record.bl_track_comments = this.Record.bl_track_comments.toUpperCase();
                break;
            }

        }
    }

    ModifiedRecords(params: any) {
        if (params.type == "TRANSIT") {
            if (params.saction == "ADD")
                this.NewTransitRecord();
            if (params.saction == "REMOVE") {
                this.Record.TransitList.splice(this.Record.TransitList.findIndex(rec => rec.trk_pkid == params.sid), 1);
                if (this.Record.TransitList.length == 0)
                    this.NewTransitRecord();
            }
        }
    }

    // AddTransit() {
    //     this.NewTransitRecord();
    // }

}


