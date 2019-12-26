
import { JobOrderModel, SearchQuery, PageQuery } from '../../../models/joborder';

import { createAction , props } from '@ngrx/store'
import { Update } from '@ngrx/entity';

export const RequestLoad = createAction('[ORDER LIST] LOAD REQUEST');
export const RequestLoadSuccess  = createAction('[ORDER LIST] LOAD REQUEST SUCCESS', props<{data : JobOrderModel}>());
export const RequestLoadFail  = createAction('[ORDER LIST] LOAD REQUEST FAIL', props<{ rec : Update<JobOrderModel> }>());

export const UpdateSearchQuery  = createAction('[ORDER LIST] UPDATE SEARCH QUERY', props<{  searchQuery : SearchQuery  }>());
export const UpdatePageQuery  = createAction('[ORDER LIST] UPDATE PAGE QUERY', props<{ pageQuery : PageQuery }>());
export const UpdateSearch  = createAction('[ORDER LIST] UPDATE RECORD', props<{ urlid: string, stype : string, data: any  }>());


export const Search = createAction('[ORDER LIST] SEARCH');
