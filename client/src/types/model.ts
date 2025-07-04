import * as THREE from 'three';

export interface LoadedModel {
  id: string;
  name: string;
  url: string;
  mesh?: THREE.Object3D;
  boundingBox?: THREE.Box3;
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
  preset: string;
}

export interface BoxDimensions {
  length: number;
  width: number;
  height: number;
}

export type ShadowQuality = 'low' | 'medium' | 'high';

export interface SceneObject {
  id: string;
  name: string;
  type: 'primitive' | 'model' | 'mesh';
  object3D: THREE.Object3D;
  visible: boolean;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
}