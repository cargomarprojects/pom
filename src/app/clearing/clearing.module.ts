import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ClearingRoutingModule } from './clearing.routing.module';
import { ClearingComponent } from './clearing.component';


import { JobOrderComponent } from './order/joborder.component';

import { JobContainerComponent } from './container/jobcontainer.component';

import { OrderListComponent } from './orderlist/orderlist.component';

import { AgentBookComponent } from './agentbook/agentbook.component';
import { TrackOrderComponent } from './trackorder/trackorder.component';
import { WeekPlanningComponent } from './weekplanning/weekplanning.component';
import {EdiOrderComponent } from './ediorder/ediorder.component';
import {EdiOrdUpdateComponent} from './ediordupdate/ediordupdate.component';

@NgModule({
  imports: [
    SharedModule,
    ClearingRoutingModule
  ],
  declarations: [
    ClearingComponent,
    JobOrderComponent,
    JobContainerComponent,
    OrderListComponent,
    AgentBookComponent,
    TrackOrderComponent,
    WeekPlanningComponent,
    EdiOrderComponent,
    EdiOrdUpdateComponent
  ],
  providers: [
  ],
})
export class ClearingModule { }
