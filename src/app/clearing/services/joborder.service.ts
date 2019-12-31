
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Joborderm } from '../models/joborder';
import { GlobalService } from '../../core/services/global.service';
import { JobOrder_VM } from '../models/joborder';


@Injectable({providedIn: 'root'})
export class JobOrderService {

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }

  List(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrder/List', SearchData, this.gs.headerparam2('authorized'));
  }

  GetRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrder/GetRecord', SearchData, this.gs.headerparam2('authorized'));
  }

  Save(Record: Joborderm) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrder/Save', Record, this.gs.headerparam2('authorized'));
  }

  LoadDefault(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrder/LoadDefault', SearchData, this.gs.headerparam2('authorized'));
  }

  DeleteRecord(SearchData: any) {

    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrder/DeleteRecord', SearchData, this.gs.headerparam2('authorized'));
  }
  
  Upload(Record: JobOrder_VM) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/OrderList/Upload', Record, this.gs.headerparam2('authorized'));
  }

}

