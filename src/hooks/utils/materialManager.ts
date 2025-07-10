import * as THREE from 'three';
import { EnhancedMaterialManager } from './enhancedMaterialManager';

// Re-export the enhanced version as the main MaterialManager
export class MaterialManager extends EnhancedMaterialManager {
  constructor() {
    super();
  }
}

// Keep backward compatibility with proper type exports
export { EnhancedMaterialManager } from './enhancedMaterialManager';
export type { MaterialType, MaterialParameters, MaterialState } from './enhancedMaterialManager';
