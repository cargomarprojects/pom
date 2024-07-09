
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blm } from '../models/mblm';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class TrkService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  GetRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Trk/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Blm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Trk/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Trk/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/Trk/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
}

