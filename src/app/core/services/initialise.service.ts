import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HouseListService } from '../../Clearing/services/houselist.service';

@Injectable({ providedIn: 'root' })
export class InitialiseService {
  constructor(
    private http2: HttpClient,
    private hs: HouseListService
  ) {
  }
 
  InitAllService() {
    this.hs.init();
  }

  
}


