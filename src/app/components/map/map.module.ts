import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { MapService } from 'src/app/services/map.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MapsEffects } from './redux/map.effects';
import { mapsKey, mapsReducer } from './redux/map.reducer';
import { IonicModule } from '@ionic/angular';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    StoreModule.forFeature(mapsKey, mapsReducer),
    EffectsModule.forFeature([MapsEffects]),
    EffectsModule.forRoot([]),
    IonicModule,
    FormsModule,
  ],
  exports: [MapComponent],
  providers: [MapService],
})
export class MapModule {}
