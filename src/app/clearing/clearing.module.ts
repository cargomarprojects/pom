import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

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

import { OrderListReducer } from './orderlist/store/orderlist.reducer';
import { OrderListEffects } from './orderlist/store/orderlist.effects';

@NgModule({
  imports: [
    SharedModule,
    ClearingRoutingModule,
    StoreModule.forFeature('orderlist', OrderListReducer),
    EffectsModule.forFeature([ OrderListEffects])
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
