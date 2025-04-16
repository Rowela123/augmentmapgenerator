export interface StateData {
  stateCode: string;
  value: number;
  stateName?: string;
}

export interface StateFeature {
  type: string;
  id: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any[];
  };
}

export interface TopoJSON {
  type: string;
  objects: {
    states: {
      type: string;
      geometries: any[];
    };
  };
  arcs: any[][];
  transform: {
    scale: [number, number];
    translate: [number, number];
  };
}
