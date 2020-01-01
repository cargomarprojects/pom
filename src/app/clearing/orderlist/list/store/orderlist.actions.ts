import { JobOrderModel, SearchQuery, PageQuery } from '../../../models/joborder';
import { createAction , props } from '@ngrx/store'
import { Update } from '@ngrx/entity';

export const RequestLoad = createAction('[ORDER LIST] LOAD REQUEST');
export const RequestLoadSuccess  = createAction('[ORDER LIST] LOAD REQUEST SUCCESS', props<{data : JobOrderModel}>());
export const RequestLoadFail  = createAction('[ORDER LIST] LOAD REQUEST FAIL', props<{ urlid: string , message : string }>());

export const Search  = createAction('[ORDER LIST] SEARCH LIST', props<{stype : string, query : any }>());

export const UpdateQuery  = createAction('[ORDER LIST] SEARCH LIST', props<{  urlid : string , stype : string, query : any }>());








