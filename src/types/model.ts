
import * as THREE from 'three';

export interface LoadedModel {
  id: string;
  name: string;
  object: THREE.Group;
  boundingBox: THREE.Box3;
  size: number;
}

export interface SunlightSettings {
  intensity: number;
  azimuth: number;
  elevation: number;
  color: string;
  castShadow: boolean;
}

export interface AmbientLightSettings {
  intensity: number;
  color: string;
}

export interface EnvironmentSettings {
  showGrid: boolean;
  groundColor: string;
  skyColor: string;
  showGround: boolean;
  preset?: string;
  background?: 'gradient' | 'solid' | 'transparent';
  cameraFov?: number;
}

export type ShadowQuality = 'low' | 'medium' | 'high';

export interface MeasureData {
  id: string;
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  distance: number;
  label: string;
}

export interface SceneObject {
  id: string;
  name: string;
  type: 'mesh' | 'group' | 'light' | 'primitive' | 'ground' | 'point' | 'measurement' | 'model' | 'environment';
  object: THREE.Object3D;
  children: SceneObject[];
  visible: boolean;
  selected: boolean;
  parent?: SceneObject;
  measurementData?: {
    startPoint: THREE.Vector3;
    endPoint: THREE.Vector3;
    distance: number;
  };
}
