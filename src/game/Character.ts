import * as THREE from 'three';
import type { CharacterConfig, AppType, DebriefPayload } from '../connector/types';
import type { IDebriefAdapter } from '../connector/types';

/**
 * Represents an NPC character in the office.
 * Each character is a blocky Minecraft-style figure with distinct colors.
 */
export class Character {
  public config: CharacterConfig;
  public mesh: THREE.Group;
  public debriefs: DebriefPayload[] = [];
  
  private adapter: IDebriefAdapter;
  private animationTime: number = 0;
  private baseY: number = 0;

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

    // Body
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: primary });
    const bodyGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.3);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);

    // Head
    const headMaterial = new THREE.MeshLambertMaterial({ color: secondary });
    const headGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.55;
    head.castShadow = true;
    group.add(head);

    // Face features
    this.addFaceFeatures(group);

    // Arms
    const armMaterial = new THREE.MeshLambertMaterial({ color: primary });
    const armGeometry = new THREE.BoxGeometry(0.15, 0.6, 0.15);
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.4, 0.9, 0);
    leftArm.castShadow = true;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.4, 0.9, 0);
    rightArm.castShadow = true;
    group.add(rightArm);

    // Legs
    const legMaterial = new THREE.MeshLambertMaterial({ color: accent });
    const legGeometry = new THREE.BoxGeometry(0.2, 0.5, 0.2);
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.15, 0.25, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.15, 0.25, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);

    // App-specific decoration
    this.addAppDecoration(group);

    // Name tag
    this.addNameTag(group);

    return group;
  }

  private addFaceFeatures(group: THREE.Group): void {
    const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const eyeGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.05);

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.12, 1.6, 0.26);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.12, 1.6, 0.26);
    group.add(rightEye);

    // Mouth
    const mouthMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const mouthGeometry = new THREE.BoxGeometry(0.15, 0.05, 0.05);
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 1.45, 0.26);
    group.add(mouth);
  }

  private addAppDecoration(group: THREE.Group): void {
    const { app } = this.config;
    
    switch (app) {
      case 'gmail':
        // Envelope on chest
        this.addEnvelopeDecoration(group);
        break;
      case 'calendar':
        // Calendar grid on chest
        this.addCalendarDecoration(group);
        break;
      case 'notion':
        // N logo approximation
        this.addNotionDecoration(group);
        break;
      case 'drive':
        // Triangle shape
        this.addDriveDecoration(group);
        break;
      case 'github':
        // Octocat face hint
        this.addGitHubDecoration(group);
        break;
    }
  }

  private addEnvelopeDecoration(group: THREE.Group): void {
    const whiteMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    const redMaterial = new THREE.MeshLambertMaterial({ color: 0xEA4335 });

    // Envelope base
    const envelope = new THREE.BoxGeometry(0.35, 0.25, 0.05);
    const envMesh = new THREE.Mesh(envelope, whiteMaterial);
    envMesh.position.set(0, 1.0, 0.18);
    group.add(envMesh);

    // Red flap
    const flap = new THREE.BoxGeometry(0.3, 0.1, 0.03);
    const flapMesh = new THREE.Mesh(flap, redMaterial);
    flapMesh.position.set(0, 1.1, 0.2);
    group.add(flapMesh);
  }

  private addCalendarDecoration(group: THREE.Group): void {
    const whiteMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    const blueMaterial = new THREE.MeshLambertMaterial({ color: 0x4285F4 });

    // Calendar base
    const cal = new THREE.BoxGeometry(0.3, 0.35, 0.05);
    const calMesh = new THREE.Mesh(cal, whiteMaterial);
    calMesh.position.set(0, 0.95, 0.18);
    group.add(calMesh);

    // Blue header
    const header = new THREE.BoxGeometry(0.3, 0.08, 0.03);
    const headerMesh = new THREE.Mesh(header, blueMaterial);
    headerMesh.position.set(0, 1.1, 0.2);
    group.add(headerMesh);

    // Grid dots
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const dotGeom = new THREE.BoxGeometry(0.04, 0.04, 0.02);
        const dot = new THREE.Mesh(dotGeom, blueMaterial);
        dot.position.set(-0.08 + col * 0.08, 0.88 + row * 0.1, 0.21);
        group.add(dot);
      }
    }
  }

  private addNotionDecoration(group: THREE.Group): void {
    const blackMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });

    // Bold N shape
    const nLeft = new THREE.BoxGeometry(0.06, 0.3, 0.03);
    const nLeftMesh = new THREE.Mesh(nLeft, blackMaterial);
    nLeftMesh.position.set(-0.1, 0.95, 0.18);
    group.add(nLeftMesh);

    const nRight = new THREE.BoxGeometry(0.06, 0.3, 0.03);
    const nRightMesh = new THREE.Mesh(nRight, blackMaterial);
    nRightMesh.position.set(0.1, 0.95, 0.18);
    group.add(nRightMesh);

    const nDiag = new THREE.BoxGeometry(0.05, 0.35, 0.03);
    const nDiagMesh = new THREE.Mesh(nDiag, blackMaterial);
    nDiagMesh.position.set(0, 0.95, 0.18);
    nDiagMesh.rotation.z = -0.5;
    group.add(nDiagMesh);
  }

  private addDriveDecoration(group: THREE.Group): void {
    const greenMaterial = new THREE.MeshLambertMaterial({ color: 0x0F9D58 });
    const blueMaterial = new THREE.MeshLambertMaterial({ color: 0x4285F4 });
    const yellowMaterial = new THREE.MeshLambertMaterial({ color: 0xF4B400 });

    // Simplified triangle colors
    const block1 = new THREE.BoxGeometry(0.15, 0.1, 0.03);
    const mesh1 = new THREE.Mesh(block1, greenMaterial);
    mesh1.position.set(-0.08, 1.05, 0.18);
    group.add(mesh1);

    const mesh2 = new THREE.Mesh(block1, blueMaterial);
    mesh2.position.set(0.08, 1.05, 0.18);
    group.add(mesh2);

    const mesh3 = new THREE.Mesh(block1, yellowMaterial);
    mesh3.position.set(0, 0.9, 0.18);
    group.add(mesh3);
  }

  private addGitHubDecoration(group: THREE.Group): void {
    const whiteMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });

    // Octocat face approximation (circle-ish)
    const face = new THREE.BoxGeometry(0.3, 0.3, 0.05);
    const faceMesh = new THREE.Mesh(face, whiteMaterial);
    faceMesh.position.set(0, 0.95, 0.18);
    group.add(faceMesh);

    // Little ears/tentacles
    const ear = new THREE.BoxGeometry(0.08, 0.12, 0.03);
    const leftEar = new THREE.Mesh(ear, whiteMaterial);
    leftEar.position.set(-0.15, 1.12, 0.18);
    group.add(leftEar);

    const rightEar = new THREE.Mesh(ear, whiteMaterial);
    rightEar.position.set(0.15, 1.12, 0.18);
    group.add(rightEar);
  }

  private addNameTag(group: THREE.Group): void {
    // Floating name tag above head using a simple colored bar
    const tagMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const tagGeometry = new THREE.BoxGeometry(1.2, 0.25, 0.05);
    const tag = new THREE.Mesh(tagGeometry, tagMaterial);
    tag.position.set(0, 2.1, 0);
    group.add(tag);

    // The actual name will be rendered in HTML overlay
  }

  async loadDebriefs(): Promise<void> {
    this.debriefs = await this.adapter.getDebriefs(this.config.app);
  }

  update(deltaTime: number): void {
    this.animationTime += deltaTime;
    
    // Gentle bobbing animation
    this.mesh.position.y = this.baseY + Math.sin(this.animationTime * 2) * 0.03;
    
    // Slight rotation to face nearby player could be added here
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
