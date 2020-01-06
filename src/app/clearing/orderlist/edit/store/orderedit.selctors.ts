
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { JobOrderEditModel } from '../../../models/joborder';
import { SelectRouterUrlId } from 'src/app/reducers';
import * as reducers from './orderedit.reducer';

export const selectOrderEditState = createFeatureSelector<reducers.OrderEditState>('orderrecord');

export const SelectAllOrders = createSelector(
  selectOrderEditState,
  reducers.adapter.getSelectors().selectAll
);

export const SelectOrderEntity = createSelector(
  SelectAllOrders,
  SelectRouterUrlId,
  (state : JobOrderEditModel[] , urlid : string) => {
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

export const SelectRecord = createSelector(
  SelectOrderEntity,
  (record: JobOrderEditModel) => {
    if (record)
      return record.record;
    else
      return null;
  }
);


export const SelectMessage = createSelector(
  SelectOrderEntity,
  (record: JobOrderEditModel) => {
    if (record)
      return record.message;
    else
      return null;
  }
);

export const SelectIsError = createSelector(
  SelectOrderEntity,
  (record: JobOrderEditModel) => {
    if (record)
      return record.isError;
    else
      return null;
  }
);


