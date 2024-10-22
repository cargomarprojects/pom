import { GlobalVariables } from '../../core/models/globalvariables';
export class Containerm {

  cntr_pkid: string;
  cntr_slno: number;
  cntr_no: string;
  cntr_teu: number;
  cntr_type_id: string;
  cntr_type_code: string;
  cntr_type_name: string;
  cntr_csealno: string;
  cntr_asealno: string;
  cntr_seal_no: string;
  cntr_booking_id: string;
  cntr_oldbooking_id: string;
  cntr_booking_no: string;
  cntr_booking_name: string;
  cntr_morh: string;
  cntr_mbl_no: string;

  cntr_stuffed_at: string;
  cntr_stuffed_on: string;

  cntr_parent_id: string;
  cntr_parent_type: string;
  cntr_pkg: number;
  cntr_pcs: number;
  cntr_grwt: number;
  cntr_ntwt: number;
  cntr_cbm: number;
  cntr_edit_code: string;
  cntr_clearing: boolean;

  cntr_mbl_book_no: string;
  cntr_mbl_etd: string;
  cntr_mbl_shipment_type: string;
  cntr_mbl_nature: string;
  cntr_trafinsp: string;
  cntr_inspsup: string;
  cntr_inspin: string;
  cntr_service_contract_id: string;
  cntr_service_contract_code: string;
  cntr_service_contract_name: string;

  rec_mode: string;
  rec_category: string;
  rec_version: number;
  cntr_egmno: string;
  cntr_egmdt: string;
  cntr_shipment_type: string;

  cntr_carrier_id: string;
  cntr_carrier_code: string;
  cntr_carrier_name: string;
  cntr_source: string;
  _globalvariables: GlobalVariables;
}
export interface SearchQuery {
  searchstring: string,
  company_code: string,
  branch_code: string,
  year_code: string,
  user_code: string,
  page_count: number,
  page_current: number,
  page_rows: number,
  page_rowcount: number
}

export interface ContainerModel {
  urlid: string;
  selectedId: string;
  message: string;
  isError: boolean;
  searchQuery: SearchQuery;
  records: Containerm[]
}
