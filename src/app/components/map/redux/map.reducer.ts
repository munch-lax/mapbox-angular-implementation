/* eslint-disable eqeqeq */
/* eslint-disable @ngrx/on-function-explicit-return-type */
import { createReducer, on } from '@ngrx/store';
import { FeatureCollection } from 'src/app/interfaces/GeoJson';
import * as MapActions from './map.actions';
export const mapsKey = 'pins';

export interface MapsState {
  pins: FeatureCollection;
}

export const initialMapsState: MapsState = {
  pins: null,
};

export const mapsReducer = createReducer(
  initialMapsState,
  on(MapActions.pinsLoaded, (state, action) => ({
    ...state,
    pins: action.pins,
  })),
  on(MapActions.addPinSuccess, (state, action) => {
    const newFeatures = [...state.pins.features, action.pin];

    return {
      ...state,
      pins: { ...state.pins, features: newFeatures },
    };
  }),
  on(MapActions.editPinSuccess, (state, action) => {
    const newFeatures = [
      ...state.pins.features.filter((obj) => obj.id != action.pin.id),
      action.pin,
    ];

    return {
      ...state,
      pins: { ...state.pins, features: newFeatures },
    };
  }),
  on(MapActions.deletePinSuccess, (state, action) => {
    const newFeatures = [
      ...state.pins.features.filter((obj) => obj.id != action.pin.id),
    ];

    return {
      ...state,
      pins: { ...state.pins, features: newFeatures },
    };
  })
);
