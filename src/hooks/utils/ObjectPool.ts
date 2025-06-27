
import * as THREE from 'three';

class Pool<T> {
  private objects: T[] = [];
  private createFn: () => T;
  private resetFn?: (obj: T) => void;

  constructor(createFn: () => T, resetFn?: (obj: T) => void, initialSize = 5) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.objects.push(this.createFn());
    }
  }

  get(): T {
    if (this.objects.length > 0) {
      return this.objects.pop()!;
    }
    return this.createFn();
  }

  release(obj: T) {
    if (this.resetFn) {
      this.resetFn(obj);
    }
    this.objects.push(obj);
  }

  clear() {
    this.objects.length = 0;
  }
}

export class ObjectPool {
  private static instance: ObjectPool;
  
  private raycasterPool: Pool<THREE.Raycaster>;
  private vector3Pool: Pool<THREE.Vector3>;
  private vector2Pool: Pool<THREE.Vector2>;

  private constructor() {
    this.raycasterPool = new Pool(
      () => new THREE.Raycaster(),
      (raycaster) => {
        raycaster.ray.origin.set(0, 0, 0);
        raycaster.ray.direction.set(0, 0, -1);
        raycaster.near = 0;
        raycaster.far = Infinity;
      }
    );

    this.vector3Pool = new Pool(
      () => new THREE.Vector3(),
      (vector) => vector.set(0, 0, 0)
    );

    this.vector2Pool = new Pool(
      () => new THREE.Vector2(),
      (vector) => vector.set(0, 0)
    );
  }

  static getInstance(): ObjectPool {
    if (!ObjectPool.instance) {
      ObjectPool.instance = new ObjectPool();
    }
    return ObjectPool.instance;
  }

  getRaycaster(): THREE.Raycaster {
    return this.raycasterPool.get();
  }

  releaseRaycaster(raycaster: THREE.Raycaster) {
    this.raycasterPool.release(raycaster);
  }

  getVector3(): THREE.Vector3 {
    return this.vector3Pool.get();
  }

  releaseVector3(vector: THREE.Vector3) {
    this.vector3Pool.release(vector);
  }

  getVector2(): THREE.Vector2 {
    return this.vector2Pool.get();
  }

  releaseVector2(vector: THREE.Vector2) {
    this.vector2Pool.release(vector);
  }

  clear() {
    this.raycasterPool.clear();
    this.vector3Pool.clear();
    this.vector2Pool.clear();
  }
}
