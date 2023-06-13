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

import { AllnumComponent } from './allnum/allnum.component';

import { CustdetComponent } from './customer/custdet.component';
import { BankInfoComponent } from './bankinfo/bankinfo.component';

import { AddbookdelComponent  } from './customer/addbookdel.component';
import { BenfComponent   } from './customer/benf.component';
import { CustGroupComponent } from './customer-group/cust-group.component';
import { PoSettingComponent } from './po-setting/po-setting.component';

@NgModule({
  imports: [
    SharedModule,
    MasterRoutingModule,
  ],
  declarations: [
    MasterComponent,
    ParamComponent,
    SysParamComponent,
    CustomerComponent,
    AddbookComponent,
    AddressmComponent,
    XmlComponent,
    AllnumComponent,
    CustdetComponent,
    BankInfoComponent,
    AddbookdelComponent,
    BenfComponent,
    CustGroupComponent,
    PoSettingComponent
  ],
  providers: [
  ],
})
export class MasterModule { }
