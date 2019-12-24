
import { JobOrderModel, SearchQuery, PageQuery } from '../../../models/joborder';

import { createAction , props } from '@ngrx/store'

export const RequestLoad = createAction('[ORDER LIST] LOAD REQUEST');

export const RequestLoadSuccess  = createAction('[ORDER LIST] LOAD REQUEST SUCCESS', props<{data : JobOrderModel}>());
export const RequestLoadFail  = createAction('[ORDER LIST] LOAD REQUEST FAIL', props<{urlid : string, message : string }>());
export const UpdateSearchQuery  = createAction('[ORDER LIST] UPDATE SEARCH QUERY', props<{searchQuery : SearchQuery }>());
export const UpdatePageQuery  = createAction('[ORDER LIST] UPDATE PAGE QUERY', props<{pageQuery : PageQuery }>());



