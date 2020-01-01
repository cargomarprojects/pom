import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as allactions from './orderlist.actions';
import { JobOrderService } from '../../../services/joborder.service';
import { concatMap, withLatestFrom, tap, filter, map, switchMap, catchError } from 'rxjs/operators';
import { of, EMPTY, combineLatest } from 'rxjs';
import { JobOrderModel, SearchQuery } from '../../../models/joborder';

import { Store, ActionsSubject } from '@ngrx/store';
import { SelectRouterUrlId, AppState } from '../../../../reducers';

import { SelectOrderEntityExists, SelectOrderEntity } from './orderlist.reducer';
import { PageQuery } from 'src/app/shared/models/pageQuery';
import { GlobalService } from 'src/app/core/services/global.service';
import { ENOSYS } from 'constants';

@Injectable({ providedIn: 'root' })
export class OrderListEffects {
    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private mainService: JobOrderService,
        private gs: GlobalService
    ) { }

    RequestInit$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.RequestLoad),
        map(() => this.store.select(SelectOrderEntityExists)),
        filter((dataExists) => {
            return (dataExists) ? true : false;
        }),
        switchMap(() => this.store.select(SelectRouterUrlId).pipe(
            map((urlid) => {
                const pagequery = <PageQuery>{ action: 'NEW', page_count: 0, page_current: 0, page_rowcount: 0, page_rows: 50 };
                const searchquery = <SearchQuery>{
                    branch_code: this.gs.globalVariables.branch_code,
                    company_code: this.gs.globalVariables.user_company_code,
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
                    ord_showpending: 'N'
                };
                const data = <JobOrderModel>{ isError: false, message: '', urlid: urlid, pageQuery: pagequery, searchQuery: searchquery, records: [] };
                return allactions.RequestLoadSuccess({ data: data })
            })
        ))
    ), { dispatch: true });


    Search$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.Search),
        concatMap(action => of(action).pipe(
            withLatestFrom(this.store.select(SelectRouterUrlId), this.store.select(SelectOrderEntity)),
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
                sort_colname: ent.searchQuery.sort_colvalue
              };

            return this.mainService.List(searchData).pipe(
                map(response => {
                    const pageQuery = <PageQuery>{ action: ent.pageQuery.action, page_rows: response.page_rows, page_count: response.page_count, page_current: response.page_current, page_rowcount: response.page_rowcount };
                    const searchquery = ent.searchQuery;
                    const data = <JobOrderModel>{ isError: false, message: '', urlid: urlid, pageQuery: pageQuery, searchQuery: searchquery, records: [] };
                    return allactions.RequestLoadSuccess({ data: data })
                }),
                catchError(err => {
                    return of(allactions.RequestLoadFail({
                        urlid: urlid,
                        message: err.error.Message
                    }))
                })
            );

        })
    ), { dispatch: true });


}
