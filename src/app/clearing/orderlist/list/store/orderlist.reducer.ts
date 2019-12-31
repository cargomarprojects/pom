import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { Joborderm, JobOrderModel, SearchQuery, PageQuery } from '../../../models/joborder';
import * as AllActions from './orderlist.actions';
import { SelectRouterUrlId } from 'src/app/reducers';

export interface AppState extends EntityState<JobOrderModel> {

}

export const adapter: EntityAdapter<JobOrderModel> = createEntityAdapter<JobOrderModel>({ selectId: orderModel => orderModel.urlid });

export const initialState: AppState = adapter.getInitialState();

export const Reducer = createReducer(
  initialState,
  on(AllActions.RequestLoadSuccess, (state, action) => {
    return adapter.upsertOne(action.data, state);
  }),
  on(AllActions.RequestLoadFail, (state, action) => {
    return adapter.updateOne({ id: action.urlid, changes: { isError: true, message: action.message } }, state);
  }),
  on(AllActions.UpdateQuery, (state, action) => {
    if (action.stype == 'SEARCH')
      return adapter.updateOne({ id: action.urlid, changes: { searchQuery: action.query } }, state);
    else
      return adapter.updateOne({ id: action.urlid, changes: { pageQuery: action.query } }, state);
  }),
);

export function OrderListReducer(state: AppState | undefined, action: Action) {
  return Reducer(state, action);
}


export const selectOrderListState = createFeatureSelector<AppState>('orderlist');


export const SelectAllOrders = createSelector(
  selectOrderListState,
  adapter.getSelectors().selectAll
);

export const SelectOrderEntity = createSelector(
  SelectAllOrders,
  SelectRouterUrlId,
  (state: JobOrderModel[], urlid: string) => {
    if (state.length > 0)
      return state[urlid];
    else
      return null;
  }
);

export const SelectOrderEntityExists = createSelector(
  SelectOrderEntity,
  (entity) => {
    if (entity)
      return true ;
    else
      return false;
  }
);


export const SelectSearchRecord = createSelector(
  SelectOrderEntity,
  (record: JobOrderModel) => {
    if (record)
      return record.searchQuery;
    else
      return <SearchQuery>{};
  }
);

export const SelectPageQuery = createSelector(
  SelectOrderEntity,
  (record: JobOrderModel) => {
    if (record)
      return record.pageQuery;
    else
      return <PageQuery>{ action: 'NEW', page_count: 0, page_current: 0, page_rowcount: 0, page_rows: 50 };
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


