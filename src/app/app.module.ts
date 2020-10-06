import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar/navbar.component';
import { AboutComponent } from './about/about/about.component';

import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { MaterialModule } from './material/material.module';
import { MatIconModule } from '@angular/material/icon';

import { environment } from '../environments/environment';

import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { MlExamplesComponent } from './ml-examples/ml-examples.component';
import { LegalNotesComponent } from './legal-notes/legal-notes.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

const appRoutes: Routes = [
  { path:  'dashboard',component:  DashboardComponent},
  { path:  'about', component:  AboutComponent },
  { path:  'history', component:  HistoryComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    AboutComponent,
    HistoryComponent,
    MlExamplesComponent,
    LegalNotesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
    MaterialModule,
    MatIconModule,
    BrowserAnimationsModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
