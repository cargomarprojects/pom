
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';

@Injectable({providedIn:'root'})
export class EdiService {

  partnerid = '';
  ErrorMessage = "";
  InfoMessage = "";
  EdiErrorList: [] = [];

  constructor(
    private http2: HttpClient,
    private gs: GlobalService) {
  }



  Validate(_type: string) {

    let SearchData = {
      company_code: this.gs.globalVariables.comp_code,
      user_code: this.gs.globalVariables.user_code,      
      partnerid: this.partnerid,
    };

    this.ErrorMessage = '';
    this.InfoMessage = '';
    this.getValidate(SearchData)
      .subscribe(response => {
        this.EdiErrorList = response.list;
        if ( response.list.length >0 )
          alert('pls check the Error List tab to see the Missing Data');
        else
        alert('No Missing Data Found');
      },
        error => {
          this.ErrorMessage = this.gs.getError(error);
        });
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

  getValidate(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Edi/Order/Validate', SearchData, this.gs.headerparam2('authorized'));
  }
  
  UpdateOrdersList(SearchData: any) {
    return this.http2.post<any>(this.gs.baseUrl + '/api/Operations/JobOrderEdi/UpdateOrdersList', SearchData, this.gs.headerparam2('authorized'));
  }
}

