
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface SunlightSettings {
  intensity: number;
  azimuth: number;
  elevation: number;
  color: string;
  castShadow: boolean;
}

interface AmbientLightSettings {
  intensity: number;
  color: string;
}

export const useLighting = (
  scene: THREE.Scene | null,
  sunlight: SunlightSettings,
  ambientLight: AmbientLightSettings,
  shadowQuality: 'low' | 'medium' | 'high'
) => {
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  useEffect(() => {
    if (!scene) return;

    // Ambient Light
    const ambient = new THREE.AmbientLight(ambientLight.color, ambientLight.intensity);
    ambientLightRef.current = ambient;
    scene.add(ambient);

    // Directional Light (Sun)
    const directional = new THREE.DirectionalLight(sunlight.color, sunlight.intensity);
    directionalLightRef.current = directional;
    
    // Position sun based on azimuth and elevation
    const azimuthRad = (sunlight.azimuth * Math.PI) / 180;
    const elevationRad = (sunlight.elevation * Math.PI) / 180;
    
    const x = Math.cos(elevationRad) * Math.sin(azimuthRad);
    const y = Math.sin(elevationRad);
    const z = Math.cos(elevationRad) * Math.cos(azimuthRad);
    
    directional.position.set(x * 10, y * 10, z * 10);
    directional.castShadow = sunlight.castShadow;
    
    // Shadow settings based on quality
    const shadowMapSize = {
      low: 512,
      medium: 1024,
      high: 2048
    };
    
    directional.shadow.mapSize.width = shadowMapSize[shadowQuality];
    directional.shadow.mapSize.height = shadowMapSize[shadowQuality];
    directional.shadow.camera.near = 0.5;
    directional.shadow.camera.far = 50;
    directional.shadow.camera.left = -10;
    directional.shadow.camera.right = 10;
    directional.shadow.camera.top = 10;
    directional.shadow.camera.bottom = -10;
    
    scene.add(directional);

    return () => {
      if (ambient) scene.remove(ambient);
      if (directional) scene.remove(directional);
    };
  }, [scene]);

  // Update sunlight properties
  useEffect(() => {
    if (!directionalLightRef.current) return;
    
    const light = directionalLightRef.current;
    light.intensity = sunlight.intensity;
    light.color.set(sunlight.color);
    light.castShadow = sunlight.castShadow;
    
    // Update position
    const azimuthRad = (sunlight.azimuth * Math.PI) / 180;
    const elevationRad = (sunlight.elevation * Math.PI) / 180;
    
    const x = Math.cos(elevationRad) * Math.sin(azimuthRad);
    const y = Math.sin(elevationRad);
    const z = Math.cos(elevationRad) * Math.cos(azimuthRad);
    
    light.position.set(x * 10, y * 10, z * 10);
  }, [sunlight]);

  // Update ambient light properties
  useEffect(() => {
    if (!ambientLightRef.current) return;
    
    ambientLightRef.current.intensity = ambientLight.intensity;
    ambientLightRef.current.color.set(ambientLight.color);
  }, [ambientLight]);

  // Update shadow quality
  useEffect(() => {
    if (!directionalLightRef.current) return;
    
    const shadowMapSize = {
      low: 512,
      medium: 1024,
      high: 2048
    };
    
    const light = directionalLightRef.current;
    light.shadow.mapSize.width = shadowMapSize[shadowQuality];
    light.shadow.mapSize.height = shadowMapSize[shadowQuality];
  }, [shadowQuality]);

  return { directionalLightRef, ambientLightRef };
};
