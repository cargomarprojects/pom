import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MasterRoutingModule } from './master.routing.module';

import { MasterComponent } from './master.component';
import { ParamComponent } from './param/param.component';

import { SysParamComponent } from './sysparam/sysparam.component';

import { CustomerComponent } from './customer/customer.component';

import { AddbookComponent } from './customer/addbook.component';

import { AddressmComponent } from './customer/addressm.component';



import { XmlComponent } from './xml/xml.component';
import { Linkm2Component } from './linkm2/linkm2.component';
import { AllnumComponent } from './allnum/allnum.component';

import { CustdetComponent } from './customer/custdet.component';
import { BankInfoComponent } from './bankinfo/bankinfo.component';

import { AddbookdelComponent  } from './customer/addbookdel.component';
import { BenfComponent   } from './customer/benf.component';

@NgModule({
  imports: [
    SharedModule,
    MasterRoutingModule
  ],
  declarations: [
    MasterComponent,
    ParamComponent,
    SysParamComponent,
    CustomerComponent,
    AddbookComponent,
    AddressmComponent,
    XmlComponent,
    Linkm2Component,
    AllnumComponent,
    CustdetComponent,
    BankInfoComponent,
    AddbookdelComponent,
    BenfComponent
  ],
  providers: [
  ],
})
export class MasterModule { }
