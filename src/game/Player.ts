import * as THREE from 'three';

export type CameraMode = 'first-person' | 'isometric';

/**
 * Player controller with WASD movement, mouse look, and camera modes.
 */
export class Player {
  public camera: THREE.PerspectiveCamera;
  public position: THREE.Vector3;
  public cameraMode: CameraMode = 'first-person';
  public onCameraModeChange?: (mode: CameraMode) => void;
  
  private velocity: THREE.Vector3;
  private moveSpeed: number = 8;
  private turnSpeed: number = 2;
  private keys: Set<string> = new Set();
  private bounds = { minX: -14, maxX: 14, minZ: -9, maxZ: 13 };
  
  private yaw: number = 0;
  private pitch: number = 0;
  private isPointerLocked: boolean = false;
  private mouseSensitivity: number = 0.002;
  
  private isoDistance: number = 20;
  private isoAngle: number = Math.PI / 4;
  private isoPitch: number = Math.PI / 4;

  constructor() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.position = new THREE.Vector3(0, 1.7, -5);
    this.velocity = new THREE.Vector3();
    
    this.camera.position.copy(this.position);
    this.yaw = Math.PI;
    this.updateCameraRotation();
    
    this.setupControls();
  }

  private setupControls(): void {
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());
      
      if (e.key.toLowerCase() === 'v') {
        this.toggleCameraMode();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement !== null;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked && this.cameraMode === 'first-person') {
        this.yaw -= e.movementX * this.mouseSensitivity;
        this.pitch -= e.movementY * this.mouseSensitivity;
        this.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));
        this.updateCameraRotation();
      }
    });

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('click', () => {
        if (this.cameraMode === 'first-person' && !this.isPointerLocked) {
          canvas.requestPointerLock();
        }
      });
    } else {
      window.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'CANVAS' && this.cameraMode === 'first-person' && !this.isPointerLocked) {
          target.requestPointerLock();
        }
      });
    }
  }

  private updateCameraRotation(): void {
    if (this.cameraMode === 'first-person') {
      const quaternion = new THREE.Quaternion();
      quaternion.setFromEuler(new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ'));
      this.camera.quaternion.copy(quaternion);
    }
  }

  toggleCameraMode(): void {
    if (this.cameraMode === 'first-person') {
      this.cameraMode = 'isometric';
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    } else {
      this.cameraMode = 'first-person';
    }
    this.onCameraModeChange?.(this.cameraMode);
  }

  update(deltaTime: number): void {
    this.velocity.set(0, 0, 0);

    let forward: THREE.Vector3;
    let right: THREE.Vector3;

    if (this.cameraMode === 'first-person') {
      forward = new THREE.Vector3();
      this.camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      right = new THREE.Vector3();
      right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    } else {
      forward = new THREE.Vector3(-Math.sin(this.isoAngle), 0, -Math.cos(this.isoAngle));
      right = new THREE.Vector3(Math.cos(this.isoAngle), 0, -Math.sin(this.isoAngle));
    }

    if (this.keys.has('w') || this.keys.has('arrowup')) {
      this.velocity.add(forward);
    }
    if (this.keys.has('s') || this.keys.has('arrowdown')) {
      this.velocity.sub(forward);
    }
    if (this.keys.has('a')) {
      this.velocity.sub(right);
    }
    if (this.keys.has('d')) {
      this.velocity.add(right);
    }

    if (this.cameraMode === 'first-person' && !this.isPointerLocked) {
      if (this.keys.has('arrowleft') || this.keys.has('q')) {
        this.yaw += this.turnSpeed * deltaTime;
        this.updateCameraRotation();
      }
      if (this.keys.has('arrowright')) {
        this.yaw -= this.turnSpeed * deltaTime;
        this.updateCameraRotation();
      }
    }

    if (this.velocity.length() > 0) {
      this.velocity.normalize().multiplyScalar(this.moveSpeed * deltaTime);
    }

    const newX = this.position.x + this.velocity.x;
    const newZ = this.position.z + this.velocity.z;

    if (newX >= this.bounds.minX && newX <= this.bounds.maxX) {
      this.position.x = newX;
    }
    if (newZ >= this.bounds.minZ && newZ <= this.bounds.maxZ) {
      this.position.z = newZ;
    }

    if (this.cameraMode === 'first-person') {
      this.camera.position.copy(this.position);
    } else {
      const offsetX = this.isoDistance * Math.sin(this.isoAngle) * Math.cos(this.isoPitch);
      const offsetY = this.isoDistance * Math.sin(this.isoPitch);
      const offsetZ = this.isoDistance * Math.cos(this.isoAngle) * Math.cos(this.isoPitch);
      
      this.camera.position.set(
        this.position.x + offsetX,
        offsetY,
        this.position.z + offsetZ
      );
      this.camera.lookAt(this.position.x, 0.5, this.position.z);
    }
  }

  isKeyPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  getPosition2D(): { x: number; z: number } {
    return { x: this.position.x, z: this.position.z };
  }

  requestPointerLock(): void {
    const canvas = document.querySelector('canvas');
    if (canvas && this.cameraMode === 'first-person') {
      canvas.requestPointerLock();
    }
  }
}
