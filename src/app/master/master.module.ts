import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MasterRoutingModule } from './master.routing.module';

import { MasterComponent } from './master.component';
import { ParamComponent } from './param/param.component';

import { CustomerComponent } from './customer/customer.component';

import { AddressmComponent } from './customer/addressm.component';

import { AddbookdelComponent  } from './customer/addbookdel.component';

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
    CustomerComponent,
    AddressmComponent,
    AddbookdelComponent,
    CustGroupComponent,
    PoSettingComponent
  ],
  providers: [
  ],
})
export class MasterModule { }
