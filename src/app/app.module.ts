import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import { YagaModule } from '@yaga/leaflet-ng2';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import {FormsModule} from '@angular/forms';
import { MapComponent } from './map/map.component'
import { CreaDefiComponent } from './crea-defi/crea-defi.component';
import { FicheDefiComponent } from './fiche-defi/fiche-defi.component';
import { GestProfilComponent } from './gest-profil/gest-profil.component';
import { EditDefiComponent } from './edit-defi/edit-defi.component';


@NgModule({
  declarations: [				
    AppComponent,
    MapComponent,
      CreaDefiComponent,
      FicheDefiComponent,
      GestProfilComponent,
      EditDefiComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    YagaModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
