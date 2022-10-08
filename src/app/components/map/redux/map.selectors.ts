import { createFeatureSelector, createSelector } from '@ngrx/store';

import { mapsKey, MapsState } from './map.reducer';

export const selectMapState = createFeatureSelector<MapsState>(mapsKey);

export const selectPins = createSelector(selectMapState, (state) => state.pins);
