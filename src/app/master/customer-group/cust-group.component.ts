import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { GlobalService } from '../../core/services/global.service';

import { CustomerGroupService } from '../services/customer-group.service';
import { SearchTable } from '../../shared/models/searchtable';
import { Customer_Groupm } from '../models/customer-group';


@Component({
    selector: 'app-cust-group',
    templateUrl: './cust-group.component.html',
    providers : [CustomerGroupService]
})
export class CustGroupComponent {
    // Local Variables 
    title = 'Customer Group';
    loading = false;
    currentTab = 'LIST';

    grp_id : string ='' ;
    grp_name : string ='' ;
    
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


    Record: Customer_Groupm ;

    RecordDet: Customer_Groupm[] = [];


    constructor(
        private mainService: CustomerGroupService,
        private location: Location,
        private route: ActivatedRoute,
        private gs: GlobalService
    ) {
        this.page_count = 0;
        this.page_rows = 50;
        this.page_current = 0;

        const data = this.route.snapshot.queryParams;

        this.grp_id  = data.grp_id;
        this.grp_name = data.grp_name;

        this.title  = 'Customer Group - ' + this.grp_name;


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
            comp_id : this.gs.globalVariables.comp_pkid
        };

        this.ErrorMessage = '';
        this.mainService.GetRecord(SearchData)
            .subscribe(response => {
                this.loading = false;
                this.RecordDet = response.list;
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
        
        this.Record =  new Customer_Groupm();
        this.Record.grp_id = this.grp_id;
        this.Record.grp_customer_id = this.cust_id;
        this.Record.grp_customer_name = this.cust_name;
        this.Record._globalvariables = this.gs.globalVariables;

        this.mainService.Save(this.Record)
            .subscribe(response => {
                this.loading = false;
                this.mode = 'EDIT';
                this.cust_id = '';
                this.cust_code = '';
                this.cust_name = '';
                this.RecordDet.push(this.Record);
            },
            error => {
              this.loading = false;
              alert( this.gs.getError(error));
            });
    }

    allvalid() {
        let sError: string = "";
        let bret: boolean = true;
        this.ErrorMessage = '';

        if ( this.gs.isBlank(this.grp_id) )
        {
            alert ('Invalid Customer Group');
            return false;
        }

        if ( this.gs.isBlank(this.cust_id) || this.gs.isBlank(this.cust_code) || this.gs.isBlank(this.cust_name) )
        {
            alert ('Invalid Customer');
            return false;
        }
        for ( let itm of this.RecordDet ) {
            if( itm.grp_customer_id == this.cust_id){
                alert ('Customer Already Exists In The List');
                return false;
            }
        }

        if (!bret)
            this.ErrorMessage = sError;
        return bret;
    }

    
    Close() {
        this.gs.ClosePage('home');
    }


    remove(rec : Customer_Groupm) {
        if ( !confirm('Remove Record ' + rec.grp_customer_name) )
        return;

        let SearchData = {
            grp_id : rec.grp_id,
            cust_id : rec.grp_customer_id,
            comp_id : this.gs.globalVariables.comp_pkid
        };

        this.ErrorMessage = '';
        this.mainService.Remove(SearchData)
            .subscribe(response => {
                this.RecordDet.splice( this.RecordDet.findIndex( f => f.grp_customer_id == rec.grp_customer_id),1 );
            },
            error => {
                alert(this.gs.getError(error));
            });
    }

}
