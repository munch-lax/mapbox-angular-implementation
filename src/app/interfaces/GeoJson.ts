export interface IGeometry {
  type: string;
  coordinates: number[];
}

export interface IGeoJson {
  id?: any;
  type: string;
  geometry: IGeometry;
  properties: any;
  $key?: string;
}

export class GeoJson implements IGeoJson {
  type = 'Feature';
  geometry: IGeometry;
  id?;
  constructor(coordinates, public properties, key?) {
    this.geometry = {
      type: 'Point',
      coordinates,
    };
    this.properties = properties;
    this.id = key ? key : null;
  }
}

export class FeatureCollection {
  type = 'FeatureCollection';
  constructor(public features: Array<GeoJson>) {}
}
