import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { AlertService } from './services/alert.service';
import { LovService } from './services/lov.service';
import { GenerateDocService } from './services/generatedoc.service';
import { GenService } from './services/gen.services';


import { AlertComponent } from './alert/alert.component';
import { AutoCompleteComponent } from './autocomplete/autocomplete.component';

import { AutoComplete2Component } from './autocomplete2/autocomplete2.component';

import { DateComponent } from './date/date.component';

import { DialogComponent } from './dialog/dialog.component';
import { WaitComponent } from './dialog-wait/wait.component';

import { ErrorMessageComponent } from './error/errorMessage';


import { FileUploadComponent } from './fileupload/fileupload.component';

import { GenerateDocComponent } from './generatedoc/generatedoc.component';

import { ClipBoardComponent } from './clipboarddata/clipboard.component';

import { MailComponent } from './mail/mail.component';
import { HistoryComponent } from './history/history.component';
import { ApprovalComponent } from './approval/approval.component';

import { PasteDataComponent } from './pastedata/pastedata.component';


import { XmlomsComponent } from './xmloms/xmloms.component';
import { AllReportComponent } from './allreport/allreport.component';
import { FtpReportComponent } from './ftpreport/ftpreport.component';
import { FileEditComponent } from './fileupload/fileedit.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    AlertComponent,
    AutoCompleteComponent,
    AutoComplete2Component,
    DateComponent,
    ErrorMessageComponent,
    DialogComponent,
    WaitComponent,
    FileUploadComponent,
    GenerateDocComponent,
    ClipBoardComponent,
    MailComponent,
    HistoryComponent,
    ApprovalComponent,
    PasteDataComponent,
    XmlomsComponent,
    AllReportComponent,
    FtpReportComponent,
    FileEditComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    NgbModule,
    AlertComponent,
    AutoCompleteComponent,
    AutoComplete2Component,
    DateComponent,
    ErrorMessageComponent,
    DialogComponent,
    WaitComponent,
    FileUploadComponent,
    GenerateDocComponent,
    ClipBoardComponent,
    MailComponent,
    HistoryComponent,
    ApprovalComponent,
    PasteDataComponent,
    XmlomsComponent,
    AllReportComponent,
    FtpReportComponent,
    FileEditComponent,

  ],
  providers: [
    AlertService,
    LovService,
    GenerateDocService
  ]
})
export class SharedModule { }
