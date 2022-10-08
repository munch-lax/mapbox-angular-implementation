import { createAction, props } from '@ngrx/store';
import { FeatureCollection, GeoJson } from 'src/app/interfaces/GeoJson';

export const loadMapPins = createAction('[Map] Load Map Pins');
export const pinsLoaded = createAction(
  '[Map] Load Map Pins Success',
  props<{ pins: FeatureCollection }>()
);

export const addPin = createAction('[Map] Add Pin', props<{ pin: GeoJson }>());
export const addPinSuccess = createAction(
  '[Map] Add Pin Success',
  props<{ pin: GeoJson }>()
);
export const addPinError = createAction(
  '[Map] Add Pin Error',
  props<{ error: any }>()
);
export const editPin = createAction(
  '[Map] Edit Pin',
  props<{ pin: GeoJson }>()
);
export const editPinSuccess = createAction(
  '[Map] Edit Pin Success',
  props<{ pin: GeoJson }>()
);
export const deletePin = createAction(
  '[Map] Delete Pin',
  props<{ pin: GeoJson }>()
);
export const deletePinSuccess = createAction(
  '[Map] Delete Pin Success',
  props<{ pin: GeoJson }>()
);
