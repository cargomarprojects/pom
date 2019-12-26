import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as allactions from './orderlist.actions';
import { JobOrderService } from '../../../services/joborder.service';
import { concatMap, withLatestFrom,tap } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { JobOrderModel, SearchQuery } from '../../../models/joborder';

import { Store, ActionsSubject } from '@ngrx/store';
import { SelectRouterUrlId, AppState } from '../../../../reducers';
import { SelectEntityExists } from './orderlist.reducer';
import { PageQuery } from 'src/app/shared/models/pageQuery';


@Injectable()
export class OrderListEffects {
    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private mainService: JobOrderService
    ) { }

    LoadList$ = createEffect(() => this.actions$.pipe(
        ofType(allactions.RequestLoad),
        concatMap(action => of(action).pipe(
            withLatestFrom(this.store.select(SelectEntityExists), this.store.select(SelectRouterUrlId))
        )),
        tap(([action, dataExists, urlid]) => {
            if (dataExists) {
                const pagequery = <PageQuery>{};
                const searchquery = <SearchQuery>{};
                const data = <JobOrderModel>{ isError: false, message: '', urlid: urlid, pageQuery: pagequery, searchQuery: searchquery, records: [] };
                allactions.RequestLoadSuccess({ data: data })
            }
        })
    ),{dispatch:false});

}
