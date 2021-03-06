import { JobOrderModel, Joborderm } from '../../../models/joborder';
import { createAction , props } from '@ngrx/store'

export const RESET= createAction('[ORDER LIST] RESET');

export const EmtyReturn = createAction('[ORDER LIST] EMPTY RETURN');

export const RequestLoad = createAction('[ORDER LIST] LOAD REQUEST');

export const RequestLoadSuccess  = createAction('[ORDER LIST] LOAD REQUEST SUCCESS', props<{data : JobOrderModel}>());

export const RequestLoadFail  = createAction('[ORDER LIST] LOAD REQUEST FAIL', props<{ urlid: string , message : string }>());

export const UpdateQuery  = createAction('[ORDER LIST] UPDATE SEARCH', props<{  urlid : string , stype : string, query : any }>());

export const Search  = createAction('[ORDER LIST] SEARCH LIST', props<{stype : string, query : any }>());

export const SelectDeselctRecord  = createAction('[ORDER LIST] UPDATE RECORD', props<{  urlid : string ,  pkid : string , ball : boolean, flag : boolean }>());

export const ChangeStatus  = createAction('[ORDER LIST] CHANGE STATUS', props<{  urlid : string ,  pkids: any[] }>());
