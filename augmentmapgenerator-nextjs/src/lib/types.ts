export interface StateData {
  stateCode: string;
  stateName: string;
  value: number | null;
  info?: string | null;
  label?: string | null;
  color?: string | null;
}

export interface MapData {
  id?: string;
  stateData: StateData[];
  colorScheme: string;
  title: string;
  legendTitle: string;
  legendMinLabel: string;
  legendMaxLabel: string;
  showLabels: boolean;
  customColors?: Record<string, string>;
  createdAt?: string;
}

export interface MapInfo {
  id: string;
  title: string;
  createdAt: string;
  embedUrl: string;
}
