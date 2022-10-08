import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { GeoJson } from '../interfaces/GeoJson';
import * as mapboxgl from 'mapbox-gl';
import { of } from 'rxjs';

@Injectable()
export class MapService {
  domain = environment.domain;
  constructor(public http: HttpClient) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  getPins() {
    return this.http.get(`${this.domain}/features`);
  }
  addPin(pin) {
    return this.http.post(`${this.domain}/features`, pin);
  }

  editPin(pin) {
    return this.http.put(`${this.domain}/features/${pin.id}`, pin);
  }
  deletePin(pin) {
    return this.http.delete(`${this.domain}/features/${pin.id}`);
  }
}
