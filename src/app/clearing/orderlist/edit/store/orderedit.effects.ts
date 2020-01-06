import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, withLatestFrom, map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { of, concat } from 'rxjs';

import { Store } from '@ngrx/store';
import { SelectRouterParam, AppState } from '../../../../reducers';
import { SelectOrderEntityExists, SelectOrderEntity } from './orderedit.selctors';
import * as allactions from './orderedit.actions';
import { SearchQuery, JobOrderEditModel, Joborderm } from '../../../models/joborder';

import { GlobalService } from 'src/app/core/services/global.service';
import { OrderListService } from 'src/app/clearing/services/orderlist.service';


@Injectable()
export class OrderEditEffects {

    LoadRequest$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.RequestLoad),
        concatMap(action => this.store.select(SelectOrderEntity)),
        switchMap(ent => this.store.select(SelectRouterParam).pipe(
            map(routeparam => {

                alert('RequestLoad Order Edit Effects');

                if (ent)
                    return allactions.EmtyReturn();
                else if (routeparam.urlid == null || routeparam.mode == null)
                    return allactions.EmtyReturn();
                else if (routeparam.mode == 'NEW') {
                    const record = <Joborderm>{};
                    const data = <JobOrderEditModel>{ isError: false, message: '', urlid: routeparam.urlid, menuid: routeparam.menuid, record: record };
                    return allactions.RequestLoadSuccess({ data: data })
                }
                else
                    return allactions.RequestGetData();
            })
        ))
    ));


    GetRecord$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.RequestGetData),
        concatMap( (action) =>  of (action).pipe( 
            withLatestFrom(this.store.select(SelectRouterParam))
        )),
        switchMap( ([action,routeparam]) => this.mainService.GetRecord({ pkid: routeparam.pkid }).pipe(
            map(response => {
                const record = <Joborderm>{};
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


    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private mainService: OrderListService,
        private gs: GlobalService
    ) { }


}
