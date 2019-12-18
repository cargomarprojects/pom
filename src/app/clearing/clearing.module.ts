import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ClearingRoutingModule } from './clearing.routing.module';
import { ClearingComponent } from './clearing.component';

import { JobComponent } from './job/job.component';

import { JobOrderComponent } from './job/order/joborder.component';

import { JobContainerComponent } from './job/container/jobcontainer.component';

import { OrderListComponent } from './job/orderlist/orderlist.component';

import { AgentBookComponent } from './job/agentbook/agentbook.component';
import { TrackOrderComponent } from './job/trackorder/trackorder.component';
import { WeekPlanningComponent } from './job/weekplanning/weekplanning.component';
import {EdiOrderComponent } from './job/ediorder/ediorder.component';
import {EdiOrdUpdateComponent} from './job/ediordupdate/ediordupdate.component';

@NgModule({
  imports: [
    SharedModule,
    ClearingRoutingModule
  ],
  declarations: [
    ClearingComponent,
    JobComponent,
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
