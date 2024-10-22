import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './orderlist/list/orderlist.component';
import {EdiOrderComponent } from './edi/ediorder/ediorder.component';
import { OrderEditComponent } from './orderlist/edit/orderedit.component';
import { TrackOrderComponent } from './trackorder/trackorder.component';
import { EdiComponent } from './edi/edi.component';
import { Linkm2Component } from './linkm2/linkm2.component';
import {EdiHblComponent } from './edi/edihbl/edihbl.component';
import { HouseListComponent } from './houselist/houselist.component';
import { HouseEditComponent } from './houselist/edit/houseedit.component';
import { VslPlanComponent } from './vslplan/list/vslplan.component';
import { VslPlanEditComponent } from './vslplan/edit/vslplan-edit.component';
import { MblmListComponent } from './mblm/list/mblmlist.component';
import { MblmEditComponent } from './mblm/edit/mblmedit.component';
import { ContainerComponent  } from './container/list/container.component';
import { ContainerEditComponent } from './container/edit/container-edit.component';

const routes: Routes = [
  { path: 'orderlist', component: OrderListComponent },
  { path: 'orderedit', component: OrderEditComponent },
  { path: 'tracking', component: TrackOrderComponent },  
  { path: 'linkm2', component: Linkm2Component },  
  { path: 'edi', component: EdiComponent },
  { path: 'ediorders', component: EdiOrderComponent },
  { path: 'edihbls', component: EdiHblComponent },
  { path: 'houselist', component: HouseListComponent },
  { path: 'houseedit', component: HouseEditComponent },
  { path: 'vslplan', component: VslPlanComponent },
  { path: 'vslplanedit', component: VslPlanEditComponent },
  { path: 'mblmlist', component: MblmListComponent },
  { path: 'mblmedit', component: MblmEditComponent },
  { path: 'containerlist', component: ContainerComponent },
  { path: 'containeredit', component: ContainerEditComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ClearingRoutingModule {
}
