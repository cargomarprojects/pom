
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Joborderm, JobOrderModel, SearchQuery } from '../../../models/joborder';

import * as AllActions from './orderlist.actions';
import { SelectRouterUrlId } from 'src/app/reducers';

export interface OrderListState extends EntityState<JobOrderModel> {
}

export const adapter: EntityAdapter<JobOrderModel> = createEntityAdapter<JobOrderModel>({
  selectId : (a : JobOrderModel) => a.urlid
});

export const initialState: OrderListState = adapter.getInitialState();

export const Reducer = createReducer(
  initialState,

  on(AllActions.RESET, (state, action) => {
    return adapter.removeAll(state);
  }),
  
  on(AllActions.RequestLoadSuccess, (state, action) => {
    return adapter.upsertOne(action.data, state);
  }),
  on(AllActions.RequestLoadFail, (state, action) => {
    return adapter.updateOne({ id: action.urlid, changes: { isError: true, message: action.message, records :[] } }, state);
  }),
  on(AllActions.UpdateQuery, (state, action) => {
      if (action.stype == 'NEW')
        return adapter.updateOne({ id: action.urlid, changes: { isError :false, message  : '', searchQuery: action.query } }, state);
      else 
        return adapter.updateOne({ id: action.urlid, changes: { isError :false, message  : '', pageQuery : action.query } }, state);
  }),
);

export function OrderListReducer(state: OrderListState | undefined, action: Action) {
  return Reducer(state, action);
}
