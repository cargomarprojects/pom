
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { JobOrderEditModel } from '../../../models/joborder';

import * as AllActions from './orderedit.actions';
import { SelectRouterUrlId } from 'src/app/reducers';

export interface OrderEditState extends EntityState<JobOrderEditModel> {
}

export const adapter: EntityAdapter<JobOrderEditModel> = createEntityAdapter<JobOrderEditModel>({
  selectId : (a : JobOrderEditModel) => a.urlid
});

export const initialState: OrderEditState = adapter.getInitialState();

export const Reducer = createReducer(
  initialState,
  on(AllActions.RequestLoadSuccess, (state, action) => {
    return adapter.upsertOne(action.data, state);
  }),
  on(AllActions.RequestLoadFail, (state, action) => {
    return adapter.updateOne({ id: action.urlid, changes: { isError: true, message: action.message, record : null } }, state);
  }),
  on(AllActions.UpdateRecord, (state, action) => {
    return adapter.updateOne({ id: action.urlid, changes: {  record : action.record } }, state);
  }),  
);

export function OrderEditReducer(state: OrderEditState | undefined, action: Action) {
  return Reducer(state, action);
}
