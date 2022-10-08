/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as mapboxgl from 'mapbox-gl';
import { filter } from 'rxjs/operators';
import { MapService } from 'src/app/services/map.service';
import { GeoJson, FeatureCollection } from '../../interfaces/GeoJson';
import { addPin, deletePin, editPin, loadMapPins } from './redux/map.actions';
import { selectPins } from './redux/map.selectors';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map;
  message = 'Newpin';
  @Input() initMap = {
    container: 'map',
    style:
      'https://api.maptiler.com/maps/eef16200-c4cc-4285-9370-c71ca24bb42d/style.json?key=SoL71Zyf7SmLrVYWC7fQ',
    zoom: 13,
    center: [-122.41, 37.75],
    projection: 'globe',
  };
  @Input() showList = true;
  source: any;
  pins$ = this.store.select(selectPins);
  features: GeoJson[];
  selectedPin: GeoJson;
  constructor(private mapService: MapService, private store: Store) {}

  ngOnInit() {
    //dispatch for loading pins
    this.store.dispatch(loadMapPins());
    this.initializeMap();
  }

  private initializeMap() {
    this.buildMap();
  }

  buildMap() {
    this.map = new mapboxgl.Map(this.initMap);

    /// Add map controls

    //// Add or edit Marker on Click
    if (this.showList) {
      this.map.on('click', (event) => {
        const coordinates = [event.lngLat.lng, event.lngLat.lat];
        let newMarker;
        if (this.selectedPin) {
          newMarker = new GeoJson(
            this.selectedPin.geometry.coordinates,
            { message: this.message },
            this.selectedPin.id
          );
          this.store.dispatch(editPin({ pin: newMarker }));
        } else {
          newMarker = new GeoJson(coordinates, { message: this.message });
          this.store.dispatch(addPin({ pin: newMarker }));
        }
      });
    }

    this.map.on('load', (event) => {
      /// register source
      this.addSource();
      this.map.resize();
      /// get source
      this.source = this.map.getSource('firebase');
      this.addLayers();
      this.pins$.pipe(filter((pins) => !!pins)).subscribe((pins) => {
        this.features = pins.features;
        this.selectedPin = null;
        this.message = 'Newpin';
        this.source.setData(pins);
        let bounds = new mapboxgl.LngLatBounds();
        this.features.map((feature) =>
          bounds.extend(feature.geometry.coordinates)
        );
        this.map.fitBounds(bounds, { padding: 50 }); //fitting all pins on map
      });
    });
  }

  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates,
      zoom: 14,
    });
  }

  editPin(data: GeoJson) {
    this.selectedPin = data;
    this.message = data.properties?.message;
  }
  deletePin(data: GeoJson) {
    this.store.dispatch(deletePin({ pin: data }));
  }
  // function for all type of sources
  addSource() {
    this.map.addSource('firebase', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    this.map.addSource('earthquakes', {
      type: 'geojson',
      data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });
  }

  //function for all kind of layers
  addLayers() {
    this.map.addLayer({
      id: 'pin',
      source: 'firebase',
      type: 'symbol',
      layout: {
        'text-field': '{message}',
        'text-size': 24,
        'text-transform': 'uppercase',
        'text-offset': [0, 1.5],
      },
      paint: {
        'text-color': '#f16624',
        'text-halo-color': '#fff',
        'text-halo-width': 2,
      },
    });
    this.map.addLayer({
      id: 'pin1',
      source: 'firebase',
      type: 'circle',

      paint: {
        'circle-color': '#000000',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      },
    });
    this.map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'earthquakes',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          750,
          '#f28cb1',
        ],
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
      },
    });
    this.map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'earthquakes',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
    });

    this.map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'earthquakes',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      },
    });
  }
}
