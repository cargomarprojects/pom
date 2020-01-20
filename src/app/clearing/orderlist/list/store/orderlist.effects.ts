import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, withLatestFrom, map, switchMap, catchError, mergeMap, filter } from 'rxjs/operators';
import { of, EMPTY, Observable, empty } from 'rxjs';
import { JobOrderModel, SearchQuery } from '../../../models/joborder';
import { Store, select } from '@ngrx/store';

import { PageQuery } from 'src/app/shared/models/pageQuery';
import { GlobalService } from 'src/app/core/services/global.service';
import { OrderListService } from 'src/app/clearing/services/orderlist.service';
import { OrderListState } from './orderlist.reducer';

import * as allactions from './orderlist.actions';
import { SelectOrderEntityExists, SelectOrderEntity } from './orderlist.selctors';
import { SelectRouterUrlId, AppState, SelectRouterId } from 'src/app/reducers';

@Injectable()
export class OrderListEffects {

    TestLoadRequet$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.RequestLoad),
        concatMap(action => of(action).pipe(
            withLatestFrom(
                this.store.pipe(select(SelectRouterUrlId)),
                this.store.select(SelectOrderEntityExists)
            ),
        )),
        switchMap(([action, urlid, flag]) => {

            if (flag || urlid == null) {
                return of(allactions.EmtyReturn());
            }
            else {
                const pagequery = <PageQuery>{ action: 'NEW', page_count: 0, page_current: 0, page_rowcount: 0, page_rows: 20 };
                const searchquery = <SearchQuery>{
                    branch_code: this.gs.globalVariables.branch_code,
                    company_code: this.gs.globalVariables.user_company_code,
                    searchstring: '',
                    file_pkid: '',
                    from_date: '',
                    job_docno: '',
                    list_agent_id: '',
                    list_agent_name: '',
                    list_exp_id: '',
                    list_exp_name: '',
                    list_imp_id: '',
                    list_imp_name: '',
                    ord_invoice: '',
                    ord_po: '',
                    report_folder: '',
                    to_date: '',
                    sort_colname: 'CREATED',
                    sort_colvalue: 'a.rec_created_date desc',
                    ord_status: 'ALL',
                    ord_showpending: 'N',
                    ftp_transfertype:'ORDERLIST',
                    ftp_is_multipleorder:'N',
                    ftp_is_checklist:'N',
                    ftp_ordpoids:''
                };
                const data = <JobOrderModel>{ isError: false, message: '', urlid: urlid, pageQuery: pagequery, searchQuery: searchquery, records: [] };
                return of(allactions.RequestLoadSuccess({ data: data }));
            }
        })
    ));


    Search$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.UpdateQuery),
        concatMap(action => of(action).pipe(
            withLatestFrom(this.store.pipe(select(SelectRouterUrlId)), this.store.select(SelectOrderEntity)),
        )),
        switchMap(([action, urlid, ent]) => {


            let searchData = {
                type: action.stype,
                rowtype: '',
                searchstring: ent.searchQuery.searchstring,
                company_code: this.gs.globalVariables.comp_code,
                branch_code: this.gs.globalVariables.branch_code,
                year_code: this.gs.globalVariables.year_code,
                page_count: ent.pageQuery.page_count,
                page_current: ent.pageQuery.page_current,
                page_rows: ent.pageQuery.page_rows,
                page_rowcount: ent.pageQuery.page_rowcount,
                job_docno: ent.searchQuery.job_docno,
                ord_po: ent.searchQuery.ord_po,
                ord_invoice: ent.searchQuery.ord_invoice,
                from_date: ent.searchQuery.from_date,
                to_date: ent.searchQuery.to_date,
                list_exp_id: ent.searchQuery.list_exp_id,
                list_imp_id: ent.searchQuery.list_imp_id,
                list_agent_id: ent.searchQuery.list_agent_id,
                ord_showpending: ent.searchQuery.ord_showpending,
                report_folder: this.gs.globalVariables.report_folder,
                file_pkid: this.gs.getGuid(),
                ord_status: ent.searchQuery.ord_status,
                sort_colname: ent.searchQuery.sort_colvalue,
                ftp_transfertype:ent.searchQuery.ftp_transfertype
            };

            return this.mainService.List(searchData).pipe(
                map(response => {
                    const pageQuery = <PageQuery>{ action: action.stype, page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
                    const searchquery = ent.searchQuery;
                    const data = <JobOrderModel>{ isError: false, message: '', urlid: urlid, pageQuery: pageQuery, searchQuery: searchquery, records: response.list };
                    return allactions.RequestLoadSuccess({ data: data });
                }),
                catchError(err => {
                    return of(allactions.RequestLoadFail({
                        urlid: urlid,
                        message: err.error.Message,
                    }))
                })
            );


        })
    ));



    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private mainService: OrderListService,
        private gs: GlobalService
    ) { }


}
