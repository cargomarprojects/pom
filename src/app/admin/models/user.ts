
import { GlobalVariables } from '../../core/models/globalvariables';
import { Userd_Customer } from './userd_customer';
import { Userd } from './userd';

export class User {
    user_pkid: string;
    user_code: string;
    user_name: string;
    user_email: string;
    user_password: string;
    user_company_id: string;
    user_branch_id: string;
    user_branch_name: string;
    user_rights_total: number;
    user_branch_user: boolean;
    user_sman_id: string;
    user_sman_code: string;
    user_sman_name: string;
    user_email_pwd: string;
    user_local_server: string;

    user_customer_group_id: string ;
    user_customer_group_code: string ;
    user_customer_group_name: string ;

    user_type_id : string ;

    rec_mode: string;

    _globalvariables: GlobalVariables;

    RecordDet: Userd[] = [];

}
