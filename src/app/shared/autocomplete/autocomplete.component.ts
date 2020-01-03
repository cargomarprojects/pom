
import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { SearchTable } from '../models/searchtable';
import { LovService } from '../services/lov.service';
import { GlobalService } from '../../core/services/global.service';


@Component({
    selector: 'app-autocomplete',
    templateUrl: './autocomplete.component.html',
    styles: [
        `
            .my-class {
                cursor: pointer;
                border-style: solid;
                border-width: 1px;
                overflow-y: scroll; 
                position: absolute;     
                height:300px;
                width:auto;
                min-width:300px;
                z-index: 2000;
                background: #fff;
                display: block;
            }
    `
    ]
})

export class AutoCompleteComponent {

    @Input() inputdata: SearchTable;
    @Output() ValueChanged = new EventEmitter<SearchTable>();
    @Input() disabled: boolean = false;

    @ViewChild('inputbox',{static:false}) private inputbox: ElementRef;

    public displaydata: string ='';

    rows_to_display : number = 0;
    rows_total: number = 0;
    rows_starting_number: number = 0;
    rows_ending_number: number = 0;

    old_data: string;

    returndata: string;

    RecList: SearchTable[] = [];

    Record: SearchTable = new SearchTable;

    showDiv = false;

    bShowMore = true;

    TableType = "";
    controlname = "";
    parentid = "";
    displaycolumn: string = "NAME";

    loading = false;

    constructor(
        private elementRef: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private gs: GlobalService,
        private lovService: LovService) {

    }

    ngOnInit() {
        this.controlname = this.inputdata.controlname;
        this.TableType = this.inputdata.type;
        this.displaycolumn = this.inputdata.displaycolumn;
        if ( this.displaycolumn == 'CODE')
            this.displaydata = this.inputdata.code;
        if (this.displaycolumn == 'NAME')
            this.displaydata = this.inputdata.name;

        this.parentid = this.inputdata.parentid;
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (let propName in changes) {
            let changedProp = changes[propName];
            let from = changedProp.previousValue;
            if (this.displaycolumn == 'CODE') {
              this.displaydata = this.inputdata.code;
            }
            if (this.displaycolumn == 'NAME') {
              this.displaydata = this.inputdata.name;
            }
        }
    }

    Focus() {
      if ( !this.disabled)
        this.inputbox.nativeElement.focus();
    }

    eventHandler(KeyCode: any) {
        this.List();
    }

    More() {
        if (this.rows_ending_number < this.rows_total)
        {
            this.rows_starting_number = this.rows_ending_number +1;
            this.rows_ending_number = this.rows_ending_number + this.rows_to_display;
            
            this.List('NEXT');
        }
    }

    List(_action : string = 'NEW') {
        this.loading = true;

        if (_action == "NEW")
        {
            this.rows_to_display = 10;
            this.rows_starting_number = 1;
            this.rows_ending_number = this.rows_to_display;
            this.bShowMore = true;
        }

        let SearchData = {
            action: _action,
            rows_to_display : this.rows_to_display,
            rows_starting_number: this.rows_starting_number,
            rows_ending_number: this.rows_ending_number,
            type: this.inputdata.type,
            parentid: this.inputdata.parentid,
            searchstring: this.displaydata,
            where : this.inputdata.where,
            comp_code: this.gs.globalVariables.comp_code,
            branch_code: this.gs.globalVariables.branch_code
        };
        
        this.lovService.List(SearchData)
            .subscribe(response => {
                //this.RecList = response.list;
                this.rows_total = response.rows_total;

                if (this.rows_ending_number >= this.rows_total)
                    this.bShowMore = false;

                this.RecList.push(...response.list);

                this.loading = false;

                if (this.RecList.length === 0) {
                    this.SelectedItem('', null);
                    this.showDiv = false;
                }
                else if (this.RecList.length === 1) {
                    this.SelectedItem('', this.RecList[0]);
                    this.showDiv = false;
                }
                else {
                    this.showDiv = true;
                }
            },
            error => {
              this.loading = false;
              this.alertService.error(error.error);
                
            }
            );
    }



    SelectedItem(_source: string, _Record: SearchTable) {
        if (_Record == null) {
            this.inputdata.id = "";
            this.inputdata.code = "";
            this.inputdata.name = "";
            this.inputdata.rate = 0;

            this.inputdata.col1 = '';
            this.inputdata.col2 = '';
            this.inputdata.col3 = '';
            this.inputdata.col4 = '';
            this.inputdata.col5 = '';
            this.inputdata.col6 = '';
            this.inputdata.col7 = '';
            this.displaydata = '';
            this.parentid = '';
            
        }
        else {
            this.inputdata.id = _Record.id;
            this.inputdata.code = _Record.code;
            this.inputdata.name = _Record.name;
            this.inputdata.rate = _Record.rate;
            if (this.displaycolumn == "CODE")
                this.displaydata = _Record.code;
            if ( this.displaycolumn == "NAME")
              this.displaydata = _Record.name;
            this.parentid = _Record.parentid;

            this.inputdata.col1 = _Record.col1;
            this.inputdata.col2 = _Record.col2;
            this.inputdata.col3 = _Record.col3;
            this.inputdata.col4 = _Record.col4;
            this.inputdata.col5 = _Record.col5;
            this.inputdata.col6 = _Record.col6;
            this.inputdata.col7 = _Record.col7;
        }


        this.showDiv = false;
        this.ValueChanged.emit(this.inputdata);
        this.RecList = [];
    }

    onfocus() {
        if (this.showDiv) {
            if (this.old_data != this.displaydata)
                this.displaydata = "";
        }
        this.old_data = this.displaydata;
        this.RecList = [];
        this.showDiv = false;
    }

    onBlur() {
        let localdata: string = "";
        if (this.displaydata === null)
            localdata = '';
        else
            localdata = this.displaydata;

        if (this.old_data != localdata) {
            if (localdata == '')
                this.SelectedItem('', null);
            else
                this.List();
        }
    }

    Cancel() {
        let localdata: string = "";
        if (this.displaydata === null)
            localdata = '';
        else
            localdata = this.displaydata;

        if (this.old_data != localdata) {
            this.SelectedItem('', null);
        }

        this.showDiv = false;
    }

    setMyStyles() {
        let styles = {
            'border': '1px solid rgba(0,0,255,0.25)',
            'margin-left': '0px',
            'border-radius': '0px',
        };
        return styles;
      }

      

}

    




