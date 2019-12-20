
import { JobOrderModel, SearchQuery, PageQuery } from '../../models/joborder';

import { createAction , props } from '@ngrx/store'

export const LoadList = createAction('[ORDER LIST] LOAD LIST', props<{searchQuery : SearchQuery, pageQuery : PageQuery}>() );

export const ListLoaded  = createAction('[ORDER LIST] LIST LOADED', props<{data : JobOrderModel}>());

