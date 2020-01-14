import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './core/login/login.component';
import { LoginBranchComponent } from './core/loginbranch/loginbranch.component';
import { ContactComponent } from './core/contact/contact.component';

const routes: Routes = [
    { path: '', redirectTo : 'login', pathMatch : 'full'  },
    { path: 'login', component: LoginComponent },
    { path: 'loginbranch', component: LoginBranchComponent },
    { path: 'home', component: HomeComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'clearing', loadChildren: () => import('./clearing/clearing.module').then(m => m.ClearingModule) },
    { path: 'master', loadChildren: () => import('./master/master.module').then(m => m.MasterModule) },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
