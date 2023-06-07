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

    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
    OrderList: Joborderm[] = [];
}

