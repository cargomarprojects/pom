import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { Params, RouterStateSnapshot } from '@angular/router';


export interface AppState {
  router: fromRouter.RouterReducerState<any>;
}

export const reducers: ActionReducerMap<AppState> = {
  router: fromRouter.routerReducer
};

export const metaReducers: MetaReducer<AppState>[] = [];

 
export const selectRouter = createFeatureSelector<AppState,fromRouter.RouterReducerState<any>>('router');
 

const {
  selectQueryParams,    // select the current route query params
  selectQueryParam,     // factory function to select a query param
  selectRouteParams,    // select the current route params
  selectRouteParam,     // factory function to select a route param
  selectRouteData,      // select the current route data
  selectUrl,            // select the current url
} = fromRouter.getSelectors(selectRouter);

export const selectSelctedUrlId = selectQueryParam('urlid');

export const SelectRouterParam = createSelector(
  selectRouter,
  (router) => {
    if (router.state) {
      return router.state.queryParams;
    }
    else
      return null;
  }
);


export const SelectRouterUrlId = createSelector(
  selectRouter,
  (router) => {
    if (router.state) {
     var mobj =  JSON.parse( router.state.queryParams.parameter); 
      return mobj.urlid;
    }
    else
      return '';
  }
);


export const SelectRouterId = createSelector(
  selectRouter,
  (router) => {
    if (router.state) {
      return router.state.queryParams.id;
    }
    else
      return null;
  }
);

export const SelectRouterMenuId = createSelector(
  selectRouter,
  (router) => {
    if (router.state) {

      var mobj =  JSON.parse( router.state.queryParams.parameter); 
      return mobj.menu_id;
    }
    else
      return null;
  }
);

export const SelectRouterMenuParam = createSelector(
  selectRouter,
  (router) => {
    if (router.state) {
      return router.state.queryParams.menu_param;
    }
    else
      return null;
  }
);


// Custom Router Serializer
export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export class CustomSerializer implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}

