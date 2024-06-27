
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Containerm } from '../models/mblm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class CntrService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Cntr/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Cntr/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Containerm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Cntr/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Cntr/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Cntr/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
}

