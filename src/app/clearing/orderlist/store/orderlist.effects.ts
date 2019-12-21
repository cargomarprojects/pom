import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as allactions from './orderlist.actions';
import { JobOrderService } from '../../services/joborder.service';
import { concatMap, map, mergeMap, withLatestFrom, switchMap } from 'rxjs/operators';
import { combineLatest,of } from 'rxjs';
import { JobOrderModel } from '../../models/joborder';

import { Store } from '@ngrx/store';
import { SelectRouterUrlId, AppState } from '../../../reducers';

@Injectable()
export class OrderListEffects {
    constructor(
        private store : Store<AppState>,
        private actions$ : Actions,
        private mainService :  JobOrderService  
    ){}

    LoadList$ = createEffect(() => this.actions$.pipe(
            ofType(allactions.RequestLoad ),
            concatMap( action => of(action).pipe(
                withLatestFrom(this.mainService.List( {...action.pageQuery, ...action.pageQuery } ), this.store.select(SelectRouterUrlId))
            )),
            map ( ( [action,data, urlid] ) => {
                const mdata = <JobOrderModel>{
                    urlid : urlid,
                    isError : false,
                    message :'',
                    pageQuery : {...action.pageQuery, page_count : data.page_count, page_current : data.page_current,page_rows: data.page_rows, page_rowcount : data.page_rowcount},
                    searchQuery : action.searchQuery,
                    records: data.list
                };
               return allactions.RequestLoadCompleted ({ data : mdata});
            })
        )
    );


}
