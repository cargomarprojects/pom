import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParamComponent } from './param/param.component';
import { SysParamComponent } from './sysparam/sysparam.component';
import { CustomerComponent } from './customer/customer.component';

import { AddbookComponent } from './customer/addbook.component';

import { XmlComponent } from './xml/xml.component';

import { AllnumComponent } from './allnum/allnum.component';


import { CustdetComponent } from './customer/custdet.component';
import { CustGroupComponent } from './customer-group/cust-group.component';
import { PoSettingComponent } from './po-setting/po-setting.component';

const routes: Routes = [
    { path: 'param', component: ParamComponent },
    { path: 'sysparam', component: SysParamComponent },
    { path: 'customer', component: CustomerComponent },
    { path: 'addbook', component: AddbookComponent },
    { path: 'xml', component: XmlComponent },
    { path: 'allnum', component: AllnumComponent },
    { path: 'custdet', component: CustdetComponent },
    { path: 'cust-group', component: CustGroupComponent },
    { path: 'po-setting', component: PoSettingComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class MasterRoutingModule {
}
