

import { GlobalVariables } from '../../core/models/globalvariables';

export class Modulem {
  module_pkid: string;
  module_name: string;
  module_parent_id: string;
  module_parent_name: string;
  module_order: number;
  rec_mode: string;

  _globalvariables: GlobalVariables;

}
