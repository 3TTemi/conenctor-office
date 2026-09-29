import * as THREE from 'three';

/**
 * Player controller with WASD movement and collision detection.
 * Renders as a simple blocky first-person camera view.
 */
export class Player {
  public camera: THREE.PerspectiveCamera;
  public position: THREE.Vector3;
  
  private velocity: THREE.Vector3;
  private moveSpeed: number = 8;
  private keys: Set<string> = new Set();
  private bounds = { minX: -14, maxX: 14, minZ: -9, maxZ: 13 };

  constructor() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.position = new THREE.Vector3(0, 1.7, -5);
    this.velocity = new THREE.Vector3();
    
    this.camera.position.copy(this.position);
    this.camera.lookAt(0, 1.7, 0);
    
    this.setupControls();
  }

  private setupControls(): void {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  update(deltaTime: number): void {
    this.velocity.set(0, 0, 0);

    // Get camera direction for movement
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    // WASD movement
    if (this.keys.has('w')) {
      this.velocity.add(forward);
    }
    if (this.keys.has('s')) {
      this.velocity.sub(forward);
    }
    if (this.keys.has('a')) {
      this.velocity.sub(right);
    }
    if (this.keys.has('d')) {
      this.velocity.add(right);
    }

    // Normalize and apply speed
    if (this.velocity.length() > 0) {
      this.velocity.normalize().multiplyScalar(this.moveSpeed * deltaTime);
    }

    // Apply movement with bounds checking
    const newX = this.position.x + this.velocity.x;
    const newZ = this.position.z + this.velocity.z;

    if (newX >= this.bounds.minX && newX <= this.bounds.maxX) {
      this.position.x = newX;
    }
    if (newZ >= this.bounds.minZ && newZ <= this.bounds.maxZ) {
      this.position.z = newZ;
    }

    this.camera.position.copy(this.position);
  }

  isKeyPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  getPosition2D(): { x: number; z: number } {
    return { x: this.position.x, z: this.position.z };
  }
}
