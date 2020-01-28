import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { ClearingRoutingModule } from './clearing.routing.module';

import { JobOrderComponent } from './order/joborder.component';
import { JobContainerComponent } from './container/jobcontainer.component';

import { AgentBookComponent } from './agentbook/agentbook.component';
import { TrackOrderComponent } from './trackorder/trackorder.component';
import { WeekPlanningComponent } from './weekplanning/weekplanning.component';
import { EdiOrderComponent } from './ediorder/ediorder.component';
import { EdiOrdUpdateComponent} from './ediordupdate/ediordupdate.component';

import { OrderListReducer } from './orderlist/list/store/orderlist.reducer';
import { OrderListEffects } from './orderlist/list/store/orderlist.effects';
import { OrderListComponent } from './orderlist/list/orderlist.component';
import { OrderListHeaderComponent } from './orderlist/list/orderlist.header.component';

import { OrderEditReducer } from './orderlist/edit/store/orderedit.reducer';
import { OrderEditEffects } from './orderlist/edit/store/orderedit.effects';
import { OrderEditComponent } from './orderlist/edit/orderedit.component';
import { OrderEditHeaderComponent } from './orderlist/edit/orderedit.header.component';
import { OrderListDetailComponent } from './orderlist/list/orderlist.detail.component';
import { StatusComponent } from './status/status.component';
import { EdiComponent } from './edi/edi.component';
import { Linkm2Component } from './linkm2/linkm2.component';


@NgModule({
  declarations: [
    JobOrderComponent,
    JobContainerComponent,
    OrderListComponent,
    OrderListHeaderComponent,
    OrderEditComponent,
    OrderEditHeaderComponent,
    AgentBookComponent,
    TrackOrderComponent,
    WeekPlanningComponent,
    EdiOrderComponent,
    EdiOrdUpdateComponent,
    OrderListDetailComponent,
    StatusComponent,
    EdiComponent,
    Linkm2Component
  ],
  imports: [
    SharedModule,
    ClearingRoutingModule,
    StoreModule.forFeature('orderlist', OrderListReducer),
    StoreModule.forFeature('orderrecord', OrderEditReducer  ),
    EffectsModule.forFeature([ OrderListEffects, OrderEditEffects])
  ],  
  providers: [
  ],
})
export class ClearingModule { }
