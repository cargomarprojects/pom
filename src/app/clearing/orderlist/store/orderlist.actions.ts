
import { JobOrderModel, SearchQuery, PageQuery } from '../../models/joborder';

import { createAction , props } from '@ngrx/store'

export const RequestLoad = createAction('[ORDER LIST] LOAD REQUEST', props<{searchQuery : SearchQuery, pageQuery : PageQuery}>() );
export const RequestLoadCompleted  = createAction('[ORDER LIST] LOAD REQUEST COMPLETE', props<{data : JobOrderModel}>());

