import { Component,  OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Observable } from 'rxjs';
import { Joborderm } from '../../models/joborder';
import * as fromOrderSelectors  from './store/orderedit.selctors';
import * as fromOrderActions  from './store/orderedit.actions';
import { OrderEditHeaderComponent } from './orderedit.header.component';

@Component({
  selector: 'App-OrderEdit',
  templateUrl: './orderedit.component.html'
})
export class OrderEditComponent {
  // Local Variables 
  title = 'Order List';
  
  urlid: string = '';
  menuid: string = '';
  InitCompleted: boolean = false;
  menu_record: any;
  bAdmin = false;
  ErrorMessage = "";
  InfoMessage = "";

  
  record$: Observable<Joborderm>;
  errorMessage$: Observable<string>;


  constructor(
    private gs: GlobalService,
    private store : Store<AppState>,
  ) {
    // URL Query Parameter 

    this.InitCompleted = true;
    this.InitComponent();
    this.record$ = this.store.select( fromOrderSelectors.SelectRecord );
    this.errorMessage$ = this.store.select(fromOrderSelectors.SelectMessage);
    this.store.dispatch(fromOrderActions.RequestLoad());
        
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    
  }

  InitComponent() {
    this.bAdmin = false;
    this.menu_record = this.gs.getMenu(this.menuid);
    if (this.menu_record) {
      this.title = this.menu_record.menu_name;
      if (this.menu_record.rights_admin)
        this.bAdmin = true;
    }
  }

  save( record : Joborderm ){

      this.store.dispatch( fromOrderActions.SaveRecord({record : record}) )
  }


  //// Destroy Will be called when this component is closed
  ngOnDestroy() {

  }


  newRecord(){
    this.store.dispatch( fromOrderActions.NewRecord());
  }

  Close() {
    this.gs.ClosePage('home', false);
  }

}
