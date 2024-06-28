
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Containerd } from '../models/mblm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class LinkCntrHblService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkCntrHbl/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Containerd) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkCntrHbl/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkCntrHbl/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/LinkCntrHbl/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
}

