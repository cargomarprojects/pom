
import { GlobalVariables } from '../../core/models/globalvariables';

export class UserHistory {
    uh_pkid: string;
    uh_parent_id: string;
    uh_source: string;
    uh_action: string;
    uh_caption: string;
    uh_old_value: string;
    uh_new_value: string;
    rec_company_code: string;
    rec_branch_code: string;
    rec_created_by: string;
    rec_created_date: string;
    rec_version: number;
    uh_ctr: number;
    rec_mode: string;
    _globalvariables: GlobalVariables;
}
