import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AboutComponent } from './about/about/about.component';
import { HistoryComponent } from './history/history.component'

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path:  'dashboard',component:  DashboardComponent},
  { path:  'about', component:  AboutComponent },
  { path:  'history', component:  HistoryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
