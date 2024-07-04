import { GlobalVariables } from '../../core/models/globalvariables';
import { PageQuery } from 'src/app/shared/models/pageQuery';

export class Blm {
  bl_pkid: string;
  bl_slno: number;
  bl_type: string;
  bl_no: string;
  bl_date: string;
  bl_mbl_id: string;
  //   ordh_detList: Joborderm[] = [];
  bl_hbl_nos: string;
  bl_cntr_nos: string;

  rec_mode: string;
  rec_category: string;
  rec_version: number;
  _globalvariables: GlobalVariables;
}

export class Containerm {
  cntr_pkid: string;
  cntr_slno: number;
  cntr_no: string;
  cntr_type_id: string;
  cntr_type_code: string;
  cntr_type_name: string;
  cntr_mbl_id: string;
  //   ordh_detList: Joborderm[] = [];

  rec_mode: string;
  rec_category: string;
  rec_version: number;
  _globalvariables: GlobalVariables;
}

export class Containerd {
  cntrd_pkid: string;
  cntrd_cntr_id: string;
  cntrd_cntr_no: string;
  cntrd_cntr_type:string;
  cntrd_mbl_id: string;
  cntrd_mbl_no: string;
  cntrd_hbl_id: string;
  cntrd_hbl_no: string;
  cntrd_slno: number;
  cntrd_selected: boolean;
  rec_mode: string;
  rec_category: string;
  rec_version: number;
  _globalvariables: GlobalVariables;
}

export class Blm_VM {
  globalvariables: GlobalVariables;
  blm: Blm[] = [];
}

export interface SearchQuery {
  type: string,
  rowtype: string,
  searchstring: string,
  company_code: string,
  branch_code: string,
  user_code: string,
  page_count: number,
  page_current: number,
  page_rows: number,
  page_rowcount: number,
  report_folder: string,
  file_pkid: string
}

export interface BlmModel {
  urlid: string;
  selectedId: string;
  message: string;
  isError: boolean;
  searchQuery: SearchQuery;
  pageQuery: PageQuery;
  records: Blm[]
}

export interface BlmEditModel {
  urlid: string;
  menuid: string;
  message: string;
  isError: boolean;
  record: Blm;
}

