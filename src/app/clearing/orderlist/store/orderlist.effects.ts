import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as allactions from './orderlist.actions';
import { JobOrderService } from '../../services/joborder.service';
import { concatMap, map, mergeMap, withLatestFrom, switchMap } from 'rxjs/operators';
import { combineLatest,of } from 'rxjs';
import { JobOrderModel } from '../../models/joborder';

@Injectable()
export class OrderListEffects {

    constructor(
        private actions$ : Actions,
        private mainService :  JobOrderService  
    ){}

    LoadList$ = createEffect(() => this.actions$.pipe(
            ofType(allactions.LoadList ),
            concatMap( action => of(action).pipe(
                withLatestFrom(this.mainService.List( {...action.pageQuery, ...action.pageQuery } ))
            )),
            map ( ( [action,data] ) => {
                const mdata = <JobOrderModel>{
                    errormessage :'',
                    pageQuery : action.pageQuery,
                    searchQuery : {...action.searchQuery, page_count : data.page_count, page_current : data.page_current,page_rows: data.page_rows, page_rowcount : data.page_rowcount  },
                    records: data.list
                };
               return allactions.ListLoaded({ data : mdata});
            })
        )
    );

}
