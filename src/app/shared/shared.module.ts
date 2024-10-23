import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LovService } from './services/lov.service';
import { AutoCompleteComponent } from './autocomplete/autocomplete.component';
import { AutoComplete2Component } from './autocomplete2/autocomplete2.component';
import { AutoComplete3Component } from './autocomplete3/autocomplete3.component';
import { DateComponent } from './date/date.component';
import { DialogComponent } from './dialog/dialog.component';
import { FileUploadComponent } from './fileupload/fileupload.component';
import { MailComponent } from './mail/mail.component';
import { HistoryComponent } from './history/history.component';
import { FileEditComponent } from './fileupload/fileedit.component';
import { PageComponent } from './page/page.component';
import { InputBoxComponent } from './input/inputbox.component';
import { InputBoxNumberComponent } from './inputnumber/inputboxnumber.component';
import { UserHistoryComponent } from './userhistory/userhistory.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    AutoCompleteComponent,
    AutoComplete2Component,
    DateComponent,
    DialogComponent,
    FileUploadComponent,
    MailComponent,
    HistoryComponent,
    FileEditComponent,
    PageComponent,
    InputBoxComponent,
    InputBoxNumberComponent,
    UserHistoryComponent,
    AutoComplete3Component
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgbModule,
    AutoCompleteComponent,
    AutoComplete2Component,
    DateComponent,
    DialogComponent,
    FileUploadComponent,
    MailComponent,
    HistoryComponent,
    FileEditComponent,
    PageComponent,
    InputBoxComponent,
    InputBoxNumberComponent,
    UserHistoryComponent,
    AutoComplete3Component
  ],
  providers: [
    LovService
  ]
})
export class SharedModule { }
