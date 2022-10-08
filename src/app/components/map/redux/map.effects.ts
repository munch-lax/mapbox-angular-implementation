/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @ngrx/prefer-effect-callback-in-block-statement */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as MapActions from './map.actions';
import { of } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { MapService } from 'src/app/services/map.service';
import { FeatureCollection, GeoJson } from 'src/app/interfaces/GeoJson';

@Injectable()
export class MapsEffects {
  constructor(private actions: Actions, private mapsService: MapService) {}

  getPins$ = createEffect(() =>
    this.actions.pipe(
      ofType(MapActions.loadMapPins),
      mergeMap(() => this.mapsService.getPins()),
      map((pins: any) => {
        const featureCollection = new FeatureCollection(pins);

        return MapActions.pinsLoaded({ pins: featureCollection });
      })
    )
  );

  addPin$ = createEffect(() =>
    this.actions.pipe(
      ofType(MapActions.addPin),
      mergeMap((action) =>
        this.mapsService.addPin(action.pin).pipe(
          map((pin: GeoJson) => MapActions.addPinSuccess({ pin })),
          catchError((error) =>
            of(
              MapActions.addPinError({
                error,
              })
            )
          )
        )
      )
    )
  );

  editPin$ = createEffect(() =>
    this.actions.pipe(
      ofType(MapActions.editPin),
      mergeMap((action) =>
        this.mapsService
          .editPin(action.pin)
          .pipe(map((pin: GeoJson) => MapActions.editPinSuccess({ pin })))
      )
    )
  );

  deletePin$ = createEffect(() =>
    this.actions.pipe(
      ofType(MapActions.deletePin),
      mergeMap((action) =>
        this.mapsService
          .deletePin(action.pin)
          .pipe(map(() => MapActions.deletePinSuccess({ pin: action.pin })))
      )
    )
  );
}
