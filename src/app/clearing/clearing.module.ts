import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ClearingRoutingModule } from './clearing.routing.module';
import { JobOrderComponent } from './order/joborder.component';
import { JobContainerComponent } from './container/jobcontainer.component';
import { AgentBookComponent } from './agentbook/agentbook.component';
import { TrackOrderComponent } from './trackorder/trackorder.component';
import { WeekPlanningComponent } from './weekplanning/weekplanning.component';
import { EdiOrderComponent } from './edi/ediorder/ediorder.component';
import { EdiOrdUpdateComponent} from './ediordupdate/ediordupdate.component';
import { OrderListComponent } from './orderlist/list/orderlist.component';
import { OrderEditComponent } from './orderlist/edit/orderedit.component';
import { StatusComponent } from './status/status.component';
import { EdiComponent } from './edi/edi.component';
import { Linkm2Component } from './linkm2/linkm2.component';
import { EdiErrorComponent } from './edi/edi-error/edi-error.component';
import { EdiHblComponent } from './edi/edihbl/edihbl.component';
import { HouseListComponent } from './houselist/houselist.component';
import { HouseEditComponent } from './houselist/edit/houseedit.component';
import { VslPlanComponent } from './vslplan/vslplan.component';
import { VslPlanEditComponent } from './vslplan/vslplan-edit.component';
import { MblmListComponent } from './mblm/list/mblmlist.component';
import { MblmEditComponent } from './mblm/edit/mblmedit.component';
import { CntrComponent } from './mblm/edit/cntr.component';
import { HblComponent } from './mblm/edit/hbl.component';
import { LinkCntrHblComponent } from './mblm/edit/link-cntr-hbl.component';

@NgModule({
  declarations: [
    JobOrderComponent,
    JobContainerComponent,
    OrderListComponent,
    OrderEditComponent,
    AgentBookComponent,
    TrackOrderComponent,
    WeekPlanningComponent,
    EdiOrderComponent,
    EdiOrdUpdateComponent,
    StatusComponent,
    EdiComponent,
    Linkm2Component,
    EdiErrorComponent,
    EdiHblComponent,
    HouseListComponent,
    HouseEditComponent,
    VslPlanComponent,
    VslPlanEditComponent,
    MblmListComponent,
    MblmEditComponent,
    CntrComponent,
    HblComponent,
    LinkCntrHblComponent
  ],
  imports: [
    SharedModule,
    ClearingRoutingModule,
  ],  
  providers: [
  ],
})
export class ClearingModule { }
