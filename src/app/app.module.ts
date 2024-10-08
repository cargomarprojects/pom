
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';



import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';



import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { GlobalService } from './core/services/global.service';
import { LoginService } from './core/services/login.service';
import { HomeComponent } from './core/home/home.component';
import { HeaderComponent } from './core/header/header.component';
import { LoginComponent } from './core/login/login.component';
import { LoginBranchComponent } from './core/loginbranch/loginbranch.component';
import { ContactComponent } from './core/contact/contact.component';
import { LoadingScreenComponent } from './core/loadingscreen/loading-screen.component';
import { InterceptorService } from './core/services/interceptor.service';
import { LoadingScreenService } from './core/services/loadingscreen.service';
import { InterceptorServiceProvider } from './core/services/interceptor.service.provider';

import { CustomRouteReuseStrategy } from './customReuseRouteStrategy';
import { RouteReuseStrategy } from '@angular/router';
import { LoadAppComponent } from './core/load-app/load-app.component';
import { ToastComponent } from './core/toast/toast.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainmenuComponent } from './core/mainmenu/mainmenu.component';
import { MatExpansionModule } from '@angular/material';



@NgModule({
  imports: [
    BrowserModule,
    NgbModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,

  ],
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    LoginBranchComponent,
    ContactComponent,
    LoadingScreenComponent,
    LoadAppComponent,
    ToastComponent,
    MainmenuComponent
  ],
  providers: [
    GlobalService,
    LoginService,
    LoadingScreenService,
    InterceptorServiceProvider,
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
