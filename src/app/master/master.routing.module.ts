import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParamComponent } from './param/param.component';
import { SysParamComponent } from './sysparam/sysparam.component';
import { CustomerComponent } from './customer/customer.component';

import { AddbookComponent } from './customer/addbook.component';

import { XmlComponent } from './xml/xml.component';

import { Linkm2Component } from '../clearing/linkm2/linkm2.component';
import { AllnumComponent } from './allnum/allnum.component';


import { CustdetComponent } from './customer/custdet.component';


const routes: Routes = [
    { path: 'param', component: ParamComponent },
    { path: 'sysparam', component: SysParamComponent },
    { path: 'customer', component: CustomerComponent },
    { path: 'addbook', component: AddbookComponent },
    { path: 'xml', component: XmlComponent },
    { path: 'allnum', component: AllnumComponent },
    { path: 'custdet', component: CustdetComponent },
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
