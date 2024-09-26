import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../../../core/services/global.service';
import { Blm } from '../../../../../models/mblm';
import { TrkService } from '../../../../../services/trk.service';
import { SearchTable } from '../../../../../../shared/models/searchtable';
import { Trackingm } from '../../../../../models/tracking';
import { Param } from '../../../../../../master/models/param';

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
    StatusList: Param[] = [];
    private errorMessage: string[] = [];
    ctr: number;
    // Array For Displaying List

    // Single Record for add/edit/view details
    Record: Blm = new Blm;
    selectedRowIndex: number = -1;

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
        this.LoadDefault();
    }

    // Destroy Will be called when this component is closed
    ngOnDestroy() {

    }

    LoadDefault() {

        this.loading = true;
        let SearchData = {
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code,
        };

        this.ms.LoadDefault(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.StatusList = response.statuslist;
            },
                error => {
                    this.loading = false;
                    alert(this.gs.getError(error));
                });

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

    NewTransitRecord(_idx: number = -1, _desc: string = 'NA', _status: string = 'NA') {
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
        Rec.trk_status = _status;
        Rec.trk_desc = _desc;
        Rec.row_colour = 'darkslategray';
        if (_idx >= 0 && this.type == "SEA EXPORT")
            this.Record.TransitList.splice(_idx + 1, 0, Rec);
        else
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
        if (this.Record.TransitList.length == 0) {
            if (this.type == "SEA EXPORT") {
                this.NewTransitRecord(0, 'POL', 'DEPA');
                this.NewTransitRecord(1, 'POD', 'ARRI');
            } else
                this.NewTransitRecord();
        }

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
        let bPOL: boolean = false;
        let bPOD: boolean = false;
        if (this.type == "SEA EXPORT") {
            for (let rec of this.Record.TransitList) {
                rec.trk_source = "MANUAL";
                if (rec.trk_desc == "POL" && rec.trk_status == "DEPA") {
                    bPOL = true;
                    this.Record.bl_pol_id = rec.trk_pol_id;
                    this.Record.bl_vessel_id = rec.trk_vsl_id;
                    this.Record.bl_vessel_no = rec.trk_voyage;
                    this.Record.bl_si_cutoff = rec.trk_si_cutoff;
                    this.Record.bl_cy_cutoff = rec.trk_cy_cutoff;
                    this.Record.bl_pol_etd = rec.trk_pol_etd;
                    this.Record.bl_pol_etd_confirm = rec.trk_pol_etd_confirm;

                }
                if (rec.trk_desc == "POD" && rec.trk_status == "ARRI") {
                    bPOD = true;
                    this.Record.bl_pod_id = rec.trk_pol_id;
                    this.Record.bl_pod_eta = rec.trk_pol_etd;
                    this.Record.bl_pod_eta_confirm = rec.trk_pol_etd_confirm;
                }

                if (rec.trk_desc == "NA") {
                    if (this.errorMessage.indexOf("Desc Cannot Be NA") < 0) {
                        bret = false;
                        this.errorMessage.push("Desc Cannot Be NA");
                    }
                }
                if (rec.trk_status == "NA") {
                    if (this.errorMessage.indexOf("Status Cannot Be NA") < 0) {
                        bret = false;
                        this.errorMessage.push("Status Cannot Be NA");
                    }
                }
                if (this.gs.isBlank(rec.trk_pol_name)) {
                    if (this.errorMessage.indexOf("Port Cannot Be Blank") < 0) {
                        bret = false;
                        this.errorMessage.push("Port Cannot Be Blank");
                    }
                }
                if (this.gs.isBlank(rec.trk_pol_etd)) {
                    if (this.errorMessage.indexOf("Date Cannot Be Blank") < 0) {
                        bret = false;
                        this.errorMessage.push("Date Cannot Be Blank");
                    }
                }

            }
            this.Record.bl_pofd_id = "";
            this.Record.bl_pofd_eta = "";
            this.Record.bl_pofd_eta_confirm = false;

            if (!bPOL) {
                bret = false;
                this.errorMessage.push("POL not found");
            }

            if (!bPOD) {
                bret = false;
                this.errorMessage.push("POD not found");
            }

        } else if (this.type == "AIR EXPORT") {
            if (this.Record.bl_vessel_id.trim().length <= 0) {
                bret = false;
                if (this.type == "AIR EXPORT")
                    this.errorMessage.push("Airline Cannot Be Blank");
                else
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
                this.NewTransitRecord(params.rindex);
            if (params.saction == "REMOVE") {
                this.Record.TransitList.splice(this.Record.TransitList.findIndex(rec => rec.trk_pkid == params.sid), 1);
                if (this.Record.TransitList.length == 0)
                    this.NewTransitRecord();
            }
        } else if (params.type == "ROWINDEX") {
            this.SetRowIndex(params.rindex);
        }
    }

    // AddTransit() {
    //     this.NewTransitRecord();
    // }
    SetRowIndex(_indx: number) {
        this.selectedRowIndex = _indx;
    }

    changePosition(thistype: string) {
        if (this.selectedRowIndex == -1)
            return;
        let _newindx: number = this.selectedRowIndex;

        if (thistype == 'UP')
            _newindx--;
        if (thistype == 'DOWN')
            _newindx++;

        if (_newindx >= 0 && _newindx < this.Record.TransitList.length) {
            this.swapItem(this.selectedRowIndex, _newindx);
            this.selectedRowIndex = _newindx;
        }
    }
    swapItem(slot1: number, slot2: number) {
        var tempVal = this.Record.TransitList[slot2];
        this.Record.TransitList[slot2] = this.Record.TransitList[slot1];
        this.Record.TransitList[slot1] = tempVal;
    }

}


