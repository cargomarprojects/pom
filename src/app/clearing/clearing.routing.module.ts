import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClearingComponent } from './clearing.component';

import { OrderListComponent } from './orderlist/list/orderlist.component';
import { AgentBookComponent } from './agentbook/agentbook.component';
import { WeekPlanningComponent } from './weekplanning/weekplanning.component';
import {EdiOrderComponent } from './ediorder/ediorder.component';

const routes: Routes = [
  { path: 'clearing', component: ClearingComponent },
  { path: 'orderlist', component: OrderListComponent },
  { path: 'orderbook', component: AgentBookComponent },
  { path: 'weekplanning', component: WeekPlanningComponent },
  { path: 'ediorders', component: EdiOrderComponent }
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
