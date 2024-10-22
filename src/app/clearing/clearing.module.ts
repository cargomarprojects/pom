import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ClearingRoutingModule } from './clearing.routing.module';
import { TrackOrderComponent } from './trackorder/trackorder.component';
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
import { VslPlanComponent } from './vslplan/list/vslplan.component';
import { VslPlanEditComponent } from './vslplan/edit/vslplan-edit.component';
import { MblmListComponent } from './mblm/list/mblmlist.component';
import { MblmEditComponent } from './mblm/edit/mblmedit.component';
import { CntrComponent } from './mblm/edit/other/cntr/cntr.component';
import { HblComponent } from './mblm/edit/other/hbl/hbl.component';
import { LinkCntrHblComponent } from './mblm/edit/other/link-cntr-hbl/link-cntr-hbl.component';
import { LinkOrdHblCntrComponent } from './vslplan/link-ord-hbl-cntr/link-ord-hbl-cntr.component';
import { TrkEditComponent } from './mblm/edit/other/tracking/edit/trk-edit.component';
import { TrkListComponent } from './mblm/edit/other/tracking/list/trk-list.component';
import { TransitComponent } from './mblm/edit/other/tracking/transit.component';
import { ContainerComponent  } from './container/list/container.component';
import { ContainerEditComponent } from './container/edit/container-edit.component';

@NgModule({
  declarations: [
    OrderListComponent,
    OrderEditComponent,
    TrackOrderComponent,
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
    LinkCntrHblComponent,
    LinkOrdHblCntrComponent,
    TrkEditComponent,
    TrkListComponent,
    TransitComponent,
    ContainerComponent,
    ContainerEditComponent
  ],
  imports: [
    SharedModule,
    ClearingRoutingModule,
  ],  
  providers: [
  ],
})
export class ClearingModule { }
