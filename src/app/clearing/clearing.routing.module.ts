import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClearingComponent } from './clearing.component';
import { JobComponent } from './job/job.component';
import { OrderListComponent } from './job/orderlist/orderlist.component';
import { AgentBookComponent } from './job/agentbook/agentbook.component';
import { WeekPlanningComponent } from './job/weekplanning/weekplanning.component';
import {EdiOrderComponent } from './job/ediorder/ediorder.component';

const routes: Routes = [
  { path: 'clearing', component: ClearingComponent },
  { path: 'jobm', component: JobComponent },
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
