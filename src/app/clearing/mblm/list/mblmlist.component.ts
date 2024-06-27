import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { GlobalService } from '../../../core/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { Blm, SearchQuery } from '../../models/mblm';
import { MblmListService } from '../../services/mblmlist.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SearchTable } from 'src/app/shared/models/searchtable';

@Component({
  selector: 'app-mblmlist',
  templateUrl: './mblmlist.component.html'
})
export class MblmListComponent {

  constructor(
    public ms: MblmListService,
    public gs: GlobalService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.gs.checkAppVersion();
    this.ms.init(this.route.snapshot.queryParams);
  }

  //// Destroy Will be called when this component is closed
  ngOnDestroy() {
  }

  ActionHandler(action: string, id: string) {
    this.ms.ErrorMessage = '';
    this.ms.InfoMessage = '';
    if (action == "ADD" && !this.ms.menu_record.rights_add) {
      alert('Insufficient User Rights')
      return;
    }
    if (action == "EDIT" && !this.ms.menu_record.rights_edit) {
      alert('Insufficient User Rights')
      return;
    }

    var urlid = this.gs.getParameter('urlid');
    let parameter = {
      urlid: this.gs.getGuid(),
      parenturlid: urlid,
      appid: this.gs.globalVariables.appid,
      menuid: this.gs.getParameter('menuid'),
      type: this.ms.type,
      pkid: id,
      origin: 'mblmlist',
      mode: action
    };

    this.router.navigate(['clearing/mblmedit'], { queryParams: parameter });

  }

  Close() {
    this.location.back();
  }

  handleChange(rec: Blm) {
    // if (rec.ord_selected)
    //   this.ms.total++;
    // else
    //   this.ms.total--;
  }

  //   SelectCheckbox(flag: boolean) {
  //     this.ms.total = 0;
  //     for (let rec of this.ms.record.records) {
  //       rec.ord_selected = flag;
  //       if (rec.ord_selected) {
  //         this.ms.total++;
  //       }
  //     }
  //   }

  LovSelected(_Record: SearchTable) {
    // if (_Record.controlname == "AGENT") {
    //   this.ms.record.searchQuery.list_agent_id = _Record.id;
    //   this.ms.record.searchQuery.list_agent_name = _Record.name;
    // }
  }


  CloseModal1(params: any) {
    // if (params.saction == 'TRACK-SAVE') {

    // }
    // this.ms.modalRef.close();
  }

}
