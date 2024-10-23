import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './orderlist/list/orderlist.component';
import { OrderEditComponent } from './orderlist/edit/orderedit.component';
import { TrackOrderComponent } from './trackorder/trackorder.component';
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
