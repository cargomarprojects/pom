import { GlobalVariables } from '../../core/models/globalvariables';
import { PageQuery } from 'src/app/shared/models/pageQuery';

export interface Joborderm {
  ord_pkid: string;
  ord_parent_id: string;
  ord_exp_id: string;
  ord_exp_name: string;
  ord_imp_id: string;
  ord_imp_name: string;
  ord_invno: string;
  ord_uneco: string;
  ord_po: string;
  ord_style: string;
  ord_cbm: number;
  ord_pcs: number;
  ord_pkg: number;
  ord_grwt: number;
  ord_ntwt: number;
  ord_hs_code: string;
  ord_cargo_status: string;
  ord_desc: string;
  ord_color: string;
  ord_stylename: string;
  ord_contractno: string;
  ord_exp_code: string;
  ord_imp_code: string;
  
  ord_agent_id: string;
  ord_agent_code: string;
  ord_agent_name: string;

  ord_pod_agent_id: string;
  ord_pod_agent_code: string;
  ord_pod_agent_name: string;

  ord_buy_agent_id: string;
  ord_buy_agent_code: string;
  ord_buy_agent_name: string;


  rec_created_by: string;
  rec_created_date: string;
  remove: string;
  ord_source: string;
  ord_selected: boolean;
  ord_booking_id: string;
  ord_approved: boolean;
  ord_booking_no: string;
  
  ord_boarding1: string;
  ord_boarding2: string;
  ord_instock1: string;
  ord_instock2: string;
  ord_booking_date: string;
  ord_rnd_insp_date: string;
  ord_po_rel_date: string;
  ord_cargo_ready_date: string;
  ord_fcr_date: string;
  ord_insp_date: string;
  ord_stuf_date: string;
  ord_whd_date: string;
  ord_track_status: string;
  ord_ourbooking_no: string;
  ord_week_no: number;
  ord_delvi_date: string;
  ord_dlv_pol_date: string;
  ord_dlv_pod_date: string;
  ord_pol: string;
  ord_pod: string;
  ord_pol_id: string;
  ord_pod_id: string;
  ord_pol_code: string;
  ord_pod_code: string;
  ord_status: string;
  ord_status_color: string;
  ord_uid: number;
  ord_plan_no: number;
  ord_agentref_id: string;
  ord_ftp_status: string;
  ord_cargo_status_date:string;
  ord_cargo_readiness_date:string;
  
  job_docno: string;
  rec_mode: string;
  rec_category: string;
  _globalvariables: GlobalVariables;
}

export class JobOrder_VM {
  globalvariables: GlobalVariables;
  JobOrder: Joborderm[] = [];
  ord_exp_id: string;
  ord_imp_id: string;
  ord_agent_id: string;
  ord_parent_id: string;
  ord_source: string;
}

export interface SearchQuery {
  type: string,
  rowtype: string,
  searchstring: string,
  company_code: string,
  branch_code: string,
  year_code: string,
  
  page_count: number,
  page_current: number,
  page_rows: number,
  page_rowcount: number,
  
  job_docno: string,
  ord_po: string,
  ord_invoice: string,
  from_date: string,
  to_date: string,
  list_exp_id: string,
  list_exp_name: string,
  list_imp_id: string,
  list_imp_name: string,
  list_agent_id: string,
  list_agent_name: string,
  list_pod_agent_id: string,
  list_pod_agent_name: string,
  list_buy_agent_id: string,
  list_buy_agent_name: string,
  ord_showpending: string,
  report_folder: string,
  file_pkid: string,
  ord_status: string,
  sort_colname: string,
  sort_colvalue: string,
  ftp_transfertype: string,
  ftp_is_multipleorder: string,
  ftp_is_checklist: string,
  ftp_ordpoids: string
}

export interface JobOrderModel {
  urlid: string;
  message: string;
  isError: boolean;
  searchQuery: SearchQuery;
  pageQuery: PageQuery;
  records: Joborderm[]
}

export interface JobOrderEditModel {
  urlid: string;
  menuid: string;
  message: string;
  isError: boolean;
  record: Joborderm;
}

