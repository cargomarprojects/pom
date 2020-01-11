
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { JobOrderModel } from '../../../models/joborder';
import { SelectRouterUrlId } from 'src/app/reducers';
import * as reducers from './orderlist.reducer';

export const selectOrderListState = createFeatureSelector<reducers.OrderListState>('orderlist');

export const SelectAllOrders = createSelector(
  selectOrderListState,
  reducers.adapter.getSelectors().selectAll
);

export const SelectOrderEntity = createSelector(
  SelectAllOrders,
  SelectRouterUrlId,
  (state : JobOrderModel[] , urlid : string) => {
    const rec =  state.find( st => st.urlid == urlid );
    return rec;
  }
);

export const SelectOrderEntityExists = createSelector  (
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

export const SelectSelectedRecords = createSelector(
  SelectOrderEntity,
  (record: JobOrderModel) => {
    if (record)
      return record.records.map( rec => rec.ord_selected)
    else
      return null;
  }
);

export const SelectSelectedRecordsCount = createSelector(
  SelectOrderEntity,
  (record: JobOrderModel) => {
    if (record)
      return record.records.reduce( (x, y) => { 
        return  (y.ord_selected) ? x + 1 : x; 
      },0);
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


