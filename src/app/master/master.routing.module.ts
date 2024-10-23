import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParamComponent } from './param/param.component';
import { CustomerComponent } from './customer/customer.component';
import { CustGroupComponent } from './customer-group/cust-group.component';
import { PoSettingComponent } from './po-setting/po-setting.component';

const routes: Routes = [
    { path: 'param', component: ParamComponent },
    { path: 'customer', component: CustomerComponent },
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
