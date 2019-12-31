import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as allactions from './orderlist.actions';
import { JobOrderService } from '../../../services/joborder.service';
import { concatMap, withLatestFrom, tap, filter, map, switchMap } from 'rxjs/operators';
import { of, EMPTY, combineLatest } from 'rxjs';
import { JobOrderModel, SearchQuery } from '../../../models/joborder';

import { Store, ActionsSubject } from '@ngrx/store';
import { SelectRouterUrlId, AppState } from '../../../../reducers';
import { SelectOrderEntityExists,  SelectOrderEntity } from './orderlist.reducer';
import { PageQuery } from 'src/app/shared/models/pageQuery';

@Injectable({providedIn:'root'})
export class OrderListEffects {
    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private mainService: JobOrderService
    ) { }

    RequestInit$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.RequestLoad),
        map(() => this.store.select(SelectOrderEntityExists)),
        filter( (dataExists)  => {
            return (dataExists) ? true : false;
        }),
        switchMap(() => this.store.select(SelectRouterUrlId).pipe(
            map((urlid) => {
                const pagequery = <PageQuery>{ action: 'NEW', page_count: 0, page_current: 0, page_rowcount: 0, page_rows: 50 };
                const searchquery = <SearchQuery>{ sort_colname :'CREATED', ord_status : 'ALL', ord_showpending : 'NA' };
                const data = <JobOrderModel>{ isError: false, message: '', urlid: urlid, pageQuery: pagequery, searchQuery: searchquery, records: [] };
                return allactions.RequestLoadSuccess({ data: data })
            })
        ))
    ), { dispatch: true });


/*     Search$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.UpdateQuery),
        concatMap(action => of(action).pipe(
            withLatestFrom(this.store.select(SelectRouterUrlId), this.store.select(SelectEntity)),
        )),
        switchMap(([action, urlid, ent]) => {
            const searchData = {};
            return this.mainService.List(searchData).pipe(
                tap(result => {
                    const pagequery = <PageQuery>{ action: 'NEW', page_count: 0, page_current: 0, page_rowcount: 0, page_rows: 50 };
                    const searchquery = <SearchQuery>{};
                    const data = <JobOrderModel>{ isError: false, message: '', urlid: urlid, pageQuery: pagequery, searchQuery: searchquery, records: [] };
                    allactions.RequestLoadSuccess({ data: data })
                })
            );
        })
    ), { dispatch: true }); */

}
