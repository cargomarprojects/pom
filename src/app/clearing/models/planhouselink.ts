import { GlobalVariables } from '../../core/models/globalvariables';
import { Containerd } from '../models/mblm';
export class PlanHouseLink {

    phl_pkid: string;
    phl_plan_id: string;
    phl_ord_id: string;
    phl_hbl_id: string;
    phl_hbl_cntr_id: string;

    rec_mode: string;
    rec_category: string;
    _globalvariables: GlobalVariables;
    linklist: Containerd[] = [];
}

