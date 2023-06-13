import { GlobalVariables } from "src/app/core/models/globalvariables";

export class PO_Settings {
    ps_pkid: string;
    ps_grp_id: string;
    ps_code: string;
    ps_name: string;
    ps_cargo_status: string;
    ps_enabled: string;
    ps_ctr: number;
    _globalvariables: GlobalVariables;
}

export class PO_Settings_VM {
    _globalvariables: GlobalVariables;
    po_settings_list: PO_Settings[] = [];
    grp_id: string;
  }