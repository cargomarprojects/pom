import { Injectable, SystemJsNgModuleLoader } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, withLatestFrom, map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { of, concat } from 'rxjs';
import { Store, select } from '@ngrx/store';


import { SearchQuery, JobOrderEditModel, Joborderm } from '../../../models/joborder';
import { GlobalService } from 'src/app/core/services/global.service';
import { OrderListService } from 'src/app/clearing/services/orderlist.service';

import * as allactions from './orderedit.actions';
import { SelectOrderEntityExists, SelectOrderEntity } from './orderedit.selctors';
import { SelectRouterParam, AppState } from '../../../../reducers';


@Injectable()
export class OrderEditEffects {

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private mainService: OrderListService,
        private gs: GlobalService
    ) { }

    loadRequest$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.RequestLoad),
        concatMap(action => of(action).pipe(
            withLatestFrom(
                this.store.pipe(select(SelectRouterParam)),
                this.store.select(SelectOrderEntity)
            ),
        )),
        switchMap(([action, routeparam, ent]) => {
            if (ent)
                return of(allactions.EmtyReturn());
            else if (routeparam.urlid == null || routeparam.mode == null)
                return of(allactions.EmtyReturn());
            else if (routeparam.mode == 'ADD') {
                return of(allactions.NewRecord());
            }
            else
                return of(allactions.RequestGetData());
        })
    ));

    SearchData = {
        type: 'ORDER',
        comp_code: this.gs.globalVariables.comp_code,
        branch_code: this.gs.globalVariables.branch_code
    };

    newRecord$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.NewRecord),
        concatMap(action => of(action).pipe(
            withLatestFrom(
                this.store.pipe(select(SelectRouterParam))
            ),
        )),
        switchMap(([action, routeparam]) => this.mainService.LoadDefault(this.SearchData).pipe(
            map(resp => {
                const record = <Joborderm>{
                    rec_mode: 'ADD', rec_category: 'SEA EXPORT',
                    ord_pkid: this.gs.getGuid(),
                    ord_agent_id: '',
                    ord_agent_code: '',
                    ord_agent_name: '',
                    ord_exp_id: '',
                    ord_exp_code: '',
                    ord_exp_name: '',
                    ord_imp_id: '',
                    ord_imp_code: '',
                    ord_imp_name: '',
                    ord_desc : '',
                    ord_cargo_status :'',
                    ord_po :'',
                    ord_style : '',
                    ord_color : '',
                    ord_pkg : 0,
                    ord_pcs :0,
                    ord_ntwt :0,
                    ord_grwt:0,
                    ord_cbm:0,
                };
                const data = <JobOrderEditModel>{ isError: false, message: '', urlid: routeparam.urlid, menuid: routeparam.menuid, record: record };
                return allactions.RequestLoadSuccess({ data: data });
            })
        ))
    ));


    getRecord$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.RequestGetData),
        concatMap((action) => of(action).pipe(
            withLatestFrom(this.store.select(SelectRouterParam))
        )),
        switchMap(([action, routeparam]) => this.mainService.GetRecord({ pkid: routeparam.pkid }).pipe(
            map(response => {
                const record = <Joborderm>response.record;
                record.rec_mode = 'EDIT';
                const data = <JobOrderEditModel>{ isError: false, message: '', urlid: routeparam.urlid, menuid: routeparam.menuid, record: response.record };
                return allactions.RequestLoadSuccess({ data: data })
            }),
            catchError(err => {
                return of(allactions.RequestLoadFail({
                    urlid: routeparam.urlid,
                    message: err.error.Message,
                }))
            })
        ))
    ));


    saveRecord$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.SaveRecord),
        concatMap((action) => of(action).pipe(
            withLatestFrom(this.store.select(SelectRouterParam))
        )),
        switchMap(([action, routeparam]) => {

            var record = { ...action.record, _globalvariables : this.gs.globalVariables };

            return this.mainService.Save(record).pipe(
                map(response => {
                    if (record.rec_mode == 'ADD') {
                        record.rec_mode = "EDIT";
                        record.ord_uid = response.uidno;
                    }
                    const data = <JobOrderEditModel>{ isError: false, message: 'Save Complete', urlid: routeparam.urlid, menuid: routeparam.menuid, record: record };
                    return allactions.RequestLoadSuccess({ data: data });
                }),
                catchError(err => {
                    return of(allactions.RequestLoadFail({
                        urlid: routeparam.urlid,
                        message: err.error.Message,
                    }))
                })
            )
        })

    ));




}
