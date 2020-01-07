
import { JobOrderEditModel, Joborderm } from '../../../models/joborder';
import { createAction , props } from '@ngrx/store'

export const RESET= createAction('[ORDER EDIT] RESET');

export const EmtyReturn = createAction('[ORDER EDIT] EMPTY RETURN');

export const RequestLoad = createAction('[ORDER EDIT] LOAD REQUEST');


export const RequestGetData = createAction('[ORDER EDIT] LOAD REQUEST DATA');

export const RequestLoadSuccess  = createAction('[ORDER EDIT] LOAD REQUEST SUCCESS', props<{data : JobOrderEditModel}>());

export const RequestLoadFail  = createAction('[ORDER EDIT] LOAD REQUEST FAIL', props<{ urlid: string , message : string }>());


export const UpdateRecord  = createAction('[ORDER EDIT] UPDATE RECORD', props<{ urlid: string, record : Joborderm }>());

export const SaveRecord  = createAction('[ORDER EDIT] SAVE RECORD', props<{ record : Joborderm }>());






