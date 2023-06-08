import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer_Groupm } from '../models/customer-group';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class CustomerGroupService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Customer/GetCustomerGroupList', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: Customer_Groupm) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Customer/SaveCustomerGroup', Record, this.gs.headerparam2('authorized'));
    }

    Remove(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Customer/RemoveCustomerGroup', SearchData, this.gs.headerparam2('authorized'));
    }
    
}

