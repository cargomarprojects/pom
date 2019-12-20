import { GlobalVariables } from '../../core/models/globalvariables';


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
  rec_created_dte: string;
  remove: string;
  ord_source: string;
  ord_selected: boolean;
  ord_booking_id: string;
  ord_approved: boolean;
  ord_booking_no: string;
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
  ord_uid: number;
  ord_plan_no:number;
  ord_agentref_id:string;
  ord_ftp_status:string;
  ord_window1:string;
  ord_window2:string;
  ord_instock1:string;
  ord_instock2:string;

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

export interface SearchQuery{
  searchString : string ;
}

export interface PageQuery {
  action : string;
  page_count: number ;
  page_current: number;
  page_rows: number ;
  page_rowcount: number ;
}

export interface JobOrderModel {
  errormessage : string;
  searchQuery : SearchQuery;
  pageQuery : PageQuery;
  records: Joborderm[]
}
