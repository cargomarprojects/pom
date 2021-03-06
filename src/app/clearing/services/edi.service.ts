
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable({providedIn:'root'})
export class EdiService {

  EdiErrorList: [] = [];

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrderEdi/List', SearchData, this.gs.headerparam2('authorized'));
  }


  TransferEdiFiles(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/edi/TransferEdiFiles', SearchData, this.gs.headerparam2('authorized'));
  }

  ImportEdiFiles(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/edi/ImportEdiFiles', SearchData, this.gs.headerparam2('authorized'));
  }
  
  UpdateOrdersList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrderEdi/UpdateOrdersList', SearchData, this.gs.headerparam2('authorized'));
  }
}

