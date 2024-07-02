
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Containerd } from '../models/mblm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class LinkOrdHblCntrService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkOrdHblCntr/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkOrdHblCntr/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Containerd) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkOrdHblCntr/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkOrdHblCntr/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkOrdHblCntr/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
}

