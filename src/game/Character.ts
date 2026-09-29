import * as THREE from 'three';
import type { CharacterConfig, AppType, DebriefPayload } from '../connector/types';
import type { IDebriefAdapter } from '../connector/types';

/**
 * Creates a pixel face texture for Steve-like characters.
 */
function createFaceTexture(primaryColor: string, accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = '#C4A57B';
  ctx.fillRect(0, 0, 8, 8);

  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, 8, 2);
  ctx.fillRect(0, 0, 1, 3);
  ctx.fillRect(7, 0, 1, 3);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(1, 2, 2, 2);
  ctx.fillRect(5, 2, 2, 2);

  ctx.fillStyle = accentColor;
  ctx.fillRect(2, 3, 1, 1);
  ctx.fillRect(5, 3, 1, 1);

  ctx.fillStyle = '#8B6954';
  ctx.fillRect(3, 5, 2, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

/**
 * Creates a body/clothing texture.
 */
function createBodyTexture(primaryColor: string, secondaryColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 12;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, 8, 12);

  ctx.fillStyle = secondaryColor;
  ctx.fillRect(0, 0, 8, 1);
  ctx.fillRect(0, 11, 8, 1);
  ctx.fillRect(0, 0, 1, 12);
  ctx.fillRect(7, 0, 1, 12);

  ctx.fillRect(3, 4, 2, 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

/**
 * Creates a limb texture.
 */
function createLimbTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 12;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 4, 12);

  const rgb = parseInt(color.slice(1), 16);
  const r = Math.max(0, ((rgb >> 16) & 255) - 30);
  const g = Math.max(0, ((rgb >> 8) & 255) - 30);
  const b = Math.max(0, (rgb & 255) - 30);
  const darker = `rgb(${r},${g},${b})`;

  ctx.fillStyle = darker;
  ctx.fillRect(0, 0, 4, 1);
  ctx.fillRect(0, 11, 4, 1);
  ctx.fillRect(0, 0, 1, 12);
  ctx.fillRect(3, 0, 1, 12);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

/**
 * Represents a Steve-like NPC character in the office.
 */
export class Character {
  public config: CharacterConfig;
  public mesh: THREE.Group;
  public debriefs: DebriefPayload[] = [];
  
  private adapter: IDebriefAdapter;
  private animationTime: number = 0;
  private leftArm: THREE.Mesh | null = null;
  private rightArm: THREE.Mesh | null = null;
  private leftLeg: THREE.Mesh | null = null;
  private rightLeg: THREE.Mesh | null = null;

  constructor(config: CharacterConfig, adapter: IDebriefAdapter) {
    this.config = config;
    this.adapter = adapter;
    this.mesh = this.createMesh();
    this.mesh.position.set(config.position.x, 0, config.position.z);
    this.loadDebriefs();
  }

  private createMesh(): THREE.Group {
    const group = new THREE.Group();
    const { primary, secondary, accent } = this.config.colors;

    const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const faceTexture = createFaceTexture(primary, accent);
    const headSideTexture = this.createHeadSideTexture(primary);
    
    const headMaterials = [
      new THREE.MeshLambertMaterial({ map: headSideTexture }),
      new THREE.MeshLambertMaterial({ map: headSideTexture }),
      new THREE.MeshLambertMaterial({ map: headSideTexture }),
      new THREE.MeshLambertMaterial({ map: headSideTexture }),
      new THREE.MeshLambertMaterial({ map: faceTexture }),
      new THREE.MeshLambertMaterial({ map: headSideTexture }),
    ];
    
    const head = new THREE.Mesh(headGeo, headMaterials);
    head.position.y = 1.65;
    head.castShadow = true;
    group.add(head);

    const bodyGeo = new THREE.BoxGeometry(0.5, 0.75, 0.25);
    const bodyTexture = createBodyTexture(primary, secondary);
    const bodyMat = new THREE.MeshLambertMaterial({ map: bodyTexture });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.025;
    body.castShadow = true;
    group.add(body);

    const armGeo = new THREE.BoxGeometry(0.25, 0.75, 0.25);
    const armTexture = createLimbTexture(primary);
    const armMat = new THREE.MeshLambertMaterial({ map: armTexture });
    
    this.leftArm = new THREE.Mesh(armGeo, armMat);
    this.leftArm.position.set(-0.375, 1.025, 0);
    this.leftArm.castShadow = true;
    group.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeo, armMat);
    this.rightArm.position.set(0.375, 1.025, 0);
    this.rightArm.castShadow = true;
    group.add(this.rightArm);

    const legGeo = new THREE.BoxGeometry(0.25, 0.75, 0.25);
    const legTexture = createLimbTexture(accent);
    const legMat = new THREE.MeshLambertMaterial({ map: legTexture });
    
    this.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.leftLeg.position.set(-0.125, 0.375, 0);
    this.leftLeg.castShadow = true;
    group.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.rightLeg.position.set(0.125, 0.375, 0);
    this.rightLeg.castShadow = true;
    group.add(this.rightLeg);

    this.addAppBadge(group);

    return group;
  }

  private createHeadSideTexture(hairColor: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 8;
    canvas.height = 8;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#C4A57B';
    ctx.fillRect(0, 0, 8, 8);

    ctx.fillStyle = hairColor;
    ctx.fillRect(0, 0, 8, 3);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }

  private addAppBadge(group: THREE.Group): void {
    const { app } = this.config;
    const badgeColors: Record<AppType, number> = {
      gmail: 0xEA4335,
      calendar: 0x4285F4,
      notion: 0x000000,
      drive: 0x0F9D58,
      github: 0x6F42C1,
    };

    const badgeGeo = new THREE.BoxGeometry(0.3, 0.3, 0.05);
    const badgeMat = new THREE.MeshBasicMaterial({ color: badgeColors[app] });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(0, 0.9, 0.15);
    group.add(badge);

    const innerGeo = new THREE.BoxGeometry(0.2, 0.2, 0.02);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.position.set(0, 0.9, 0.18);
    group.add(inner);
  }

  async loadDebriefs(): Promise<void> {
    this.debriefs = await this.adapter.getDebriefs(this.config.app);
  }

  update(deltaTime: number): void {
    this.animationTime += deltaTime;

    const breathe = Math.sin(this.animationTime * 2) * 0.01;
    this.mesh.position.y = breathe;

    if (this.leftArm && this.rightArm) {
      const armSwing = Math.sin(this.animationTime * 1.5) * 0.1;
      this.leftArm.rotation.x = armSwing;
      this.rightArm.rotation.x = -armSwing;
    }

    if (this.leftLeg && this.rightLeg) {
      const legSwing = Math.sin(this.animationTime * 1.5) * 0.05;
      this.leftLeg.rotation.x = -legSwing;
      this.rightLeg.rotation.x = legSwing;
    }
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position.clone();
  }

  distanceTo(playerPos: { x: number; z: number }): number {
    const dx = this.mesh.position.x - playerPos.x;
    const dz = this.mesh.position.z - playerPos.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  getAppName(): string {
    const names: Record<AppType, string> = {
      gmail: '📧 Gmail',
      calendar: '📅 Calendar',
      notion: '📝 Notion',
      drive: '📁 Drive',
      github: '🐙 GitHub',
    };
    return names[this.config.app];
  }

  getDisplayName(): string {
    return this.config.name;
  }
}

/**
 * Manages all characters in the office
 */
export class CharacterManager {
  private characters: Character[] = [];
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene, adapter: IDebriefAdapter, configs: CharacterConfig[]) {
    this.scene = scene;
    
    configs.forEach(config => {
      const character = new Character(config, adapter);
      this.characters.push(character);
      this.scene.add(character.mesh);
    });
  }

  update(deltaTime: number): void {
    this.characters.forEach(char => char.update(deltaTime));
  }

  getNearestCharacter(playerPos: { x: number; z: number }): Character | null {
    let nearest: Character | null = null;
    let nearestDist = Infinity;

    this.characters.forEach(char => {
      const dist = char.distanceTo(playerPos);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = char;
      }
    });

    return nearest;
  }

  isPlayerNearCharacter(playerPos: { x: number; z: number }, threshold: number = 2.5): Character | null {
    const nearest = this.getNearestCharacter(playerPos);
    if (nearest && nearest.distanceTo(playerPos) < threshold) {
      return nearest;
    }
    return null;
  }

  getCharacters(): Character[] {
    return this.characters;
  }
}
