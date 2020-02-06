import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderListComponent } from './orderlist/list/orderlist.component';
import { AgentBookComponent } from './agentbook/agentbook.component';
import { WeekPlanningComponent } from './weekplanning/weekplanning.component';
import {EdiOrderComponent } from './edi/ediorder/ediorder.component';
import { OrderEditComponent } from './orderlist/edit/orderedit.component';
import { TrackOrderComponent } from './trackorder/trackorder.component';
import { EdiComponent } from './edi/edi.component';
import { Linkm2Component } from './linkm2/linkm2.component';
import {EdiHblComponent } from './edi/edihbl/edihbl.component';
import { HouseListComponent } from './houselist/houselist.component';
import { HouseEditComponent } from './houselist/edit/houseedit.component';

const routes: Routes = [
  { path: 'orderlist', component: OrderListComponent },
  { path: 'orderedit', component: OrderEditComponent },
  { path: 'orderbook', component: AgentBookComponent },
  { path: 'tracking', component: TrackOrderComponent },  
  { path: 'weekplanning', component: WeekPlanningComponent },
  { path: 'linkm2', component: Linkm2Component },  
  { path: 'edi', component: EdiComponent },
  { path: 'ediorders', component: EdiOrderComponent },
  { path: 'edihbls', component: EdiHblComponent },
  { path: 'houselist', component: HouseListComponent },
  { path: 'houseedit', component: HouseEditComponent },
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
