import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { Joborderm, JobOrderModel, SearchQuery, PageQuery } from '../../../models/joborder';
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
        return adapter.updateOne({ id: action.urlid, changes: { isError :false, message  : '', pageQuery: action.query } }, state);
  }),
);

export function OrderListReducer(state: OrderListState | undefined, action: Action) {
  return Reducer(state, action);
}


export const selectOrderListState = createFeatureSelector<OrderListState>('orderlist');


export const SelectAllOrders = createSelector(
  selectOrderListState,
  adapter.getSelectors().selectAll
);

export const SelectOrderEntity = createSelector(
  SelectAllOrders,
  SelectRouterUrlId,
  (state : JobOrderModel[] , urlid : string) => {
    const rec =  state.find( st => st.urlid == urlid );
    return rec;
  }
);

export const SelectOrderEntityExists = createSelector(
  SelectOrderEntity,
  (entity) => {
    if (entity)
      return true;
    else
      return false;
  }
);


export const SelectSearchRecord = createSelector(
  SelectOrderEntity,
  (entity : JobOrderModel) => {
      return (entity) ? entity.searchQuery : null;
  }
);

export const SelectPageQuery = createSelector(
  SelectOrderEntity,
  (record: JobOrderModel) => {
      return  (record) ? record.pageQuery : null;
  }
);

export const SelectRecords = createSelector(
  SelectOrderEntity,
  (record: JobOrderModel) => {
    if (record)
      return record.records;
    else
      return null;
  }
);


export const SelectMessage = createSelector(
  SelectOrderEntity,
  (record: JobOrderModel) => {
    if (record)
      return record.message;
    else
      return null;
  }
);

export const SelectIsError = createSelector(
  SelectOrderEntity,
  (record: JobOrderModel) => {
    if (record)
      return record.isError;
    else
      return null;
  }
);


