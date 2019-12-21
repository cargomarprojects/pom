import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Joborderm, JobOrderModel } from '../../models/joborder';
import * as AllActions from './orderlist.actions';
 
export interface State extends EntityState<JobOrderModel> {

} 
export const adapter: EntityAdapter<JobOrderModel> = createEntityAdapter<JobOrderModel>({
    selectId : order => order.urlid
});
 
export const initialState: State = adapter.getInitialState({
});
 
export const _Reducer = createReducer(
  initialState,
  on(AllActions.RequestLoadCompleted, (state,action) => {
    adapter.removeOne(action.data.urlid, state);
    return adapter.addOne( action.data, state );
  })
);
 
export function reducer(state: State | undefined, action: Action) {
  return _Reducer(state, action);
}