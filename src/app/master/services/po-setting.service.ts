import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PO_Settings,PO_Settings_VM } from '../models/po-setting';
import { GlobalService } from '../../core/services/global.service';

@Injectable()
export class POSettingService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService) {
    }

    GetRecord(SearchData: any) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Customer/GetPOSettingList', SearchData, this.gs.headerparam2('authorized'));
    }

    Save(Record: PO_Settings_VM) {
      return this.http2.post<any>(this.gs.baseUrl + '/api/Master/Customer/SavePOSetting', Record, this.gs.headerparam2('authorized'));
    }
   
    
}

