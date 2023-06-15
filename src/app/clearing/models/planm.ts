import { GlobalVariables } from '../../core/models/globalvariables';
import { Joborderm } from '../../clearing/models/joborder';

export class Planm {

    vp_pkid: string;
    vp_plan_no: number;
    vp_plan_date: string;
    vp_week_no: number;
    vp_etd: string;
    vp_vessel_id: string;
    vp_vessel_code: string;
    vp_vessel_name: string;
    vp_voyage: string;
    vp_status: string;
    vp_comments: string;
    vp_pol_agent_id: string;
    vp_pol_agent_code: string;
    vp_pol_agent_name: string;
    vp_pod_agent_id: string;
    vp_pod_agent_code: string;
    vp_pod_agent_name: string;
    vp_imp_id: string;
    vp_imp_code: string;
    vp_imp_name: string;
    vp_type: string;
    vp_hide:string;

    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
    OrderList: Joborderm[] = [];
}

export interface SearchQuery {
    type: string,
    rowtype: string,
    searchstring: string,
    company_code: string,
    branch_code: string,
    year_code: string,
    user_code: string,
    page_count: number,
    page_current: number,
    page_rows: number,
    page_rowcount: number,
    pol_agent_id: string,
    imp_id: string,
    pod_agent_id: string,
    vessel_id: string,
    status: string,
    list_pol_agent_id: string,
    list_pol_agent_name: string,
    list_imp_id: string,
    list_imp_name: string,
    list_pod_agent_id: string,
    list_pod_agent_name: string,
    list_vessel_id: string,
    list_vessel_name: string,
    list_status: string
}

export interface PlanModel {
    urlid: string;
    selectedId: string;
    message: string;
    isError: boolean;
    searchQuery: SearchQuery;
    records: Planm[]
}
