import * as THREE from 'three';
import { World } from './game/World';
import { Player, CameraMode } from './game/Player';
import { CharacterManager } from './game/Character';
import { DebriefPanel } from './ui/DebriefPanel';
import { Prompt } from './ui/Prompt';
import { createDebriefAdapter } from './connector/DebriefAdapter';
import { characterConfigs } from './data/fixtures';

/**
 * Connector Office - Main Entry Point
 * 
 * A Minecraft-style virtual office where each character represents
 * a connected app and debriefs you on the past day's activity.
 */
class ConnectorOffice {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private player: Player;
  private characterManager: CharacterManager;
  private debriefPanel: DebriefPanel;
  private prompt: Prompt;
  
  private clock: THREE.Clock;
  private isRunning: boolean = true;
  
  private cameraToggleBtn: HTMLElement;
  private mouseHint: HTMLElement;
  private crosshair: HTMLElement;

  constructor() {
    // Initialize Three.js
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
    this.scene.fog = new THREE.Fog(0x87CEEB, 20, 50);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const container = document.getElementById('game-container')!;
    container.insertBefore(this.renderer.domElement, container.firstChild);

    // Initialize game components
    this.player = new Player();
    new World(this.scene);
    
    // Initialize adapter and characters
    const adapter = createDebriefAdapter();
    this.characterManager = new CharacterManager(this.scene, adapter, characterConfigs);
    
    // Initialize UI
    this.debriefPanel = new DebriefPanel();
    this.prompt = new Prompt();
    this.cameraToggleBtn = document.getElementById('camera-toggle')!;
    this.mouseHint = document.getElementById('mouse-hint')!;
    this.crosshair = document.getElementById('crosshair')!;
    
    this.clock = new THREE.Clock();

    // Setup event listeners
    this.setupEventListeners();
    this.setupCameraUI();
    
    // Start game loop
    this.animate();

    console.log('🏢 Connector Office initialized!');
    console.log('Use WASD to move, click to look around, E to talk to characters');
  }
  
  private setupCameraUI(): void {
    this.cameraToggleBtn.addEventListener('click', () => {
      this.player.toggleCameraMode();
    });
    
    this.player.onCameraModeChange = (mode: CameraMode) => {
      this.updateCameraUI(mode);
    };
    
    document.addEventListener('pointerlockchange', () => {
      const isLocked = document.pointerLockElement !== null;
      this.mouseHint.classList.toggle('hidden', isLocked);
      this.crosshair.classList.toggle('hidden', !isLocked || this.player.cameraMode !== 'first-person');
    });
    
    this.updateCameraUI(this.player.cameraMode);
  }
  
  private updateCameraUI(mode: CameraMode): void {
    if (mode === 'first-person') {
      this.cameraToggleBtn.textContent = '📷 First-Person [V]';
      this.mouseHint.classList.remove('hidden');
      this.crosshair.classList.add('hidden');
    } else {
      this.cameraToggleBtn.textContent = '🗺️ Isometric [V]';
      this.mouseHint.classList.add('hidden');
      this.crosshair.classList.add('hidden');
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', (e) => {
      // E to interact
      if (e.key.toLowerCase() === 'e' && !this.debriefPanel.isShowing()) {
        const nearChar = this.characterManager.isPlayerNearCharacter(
          this.player.getPosition2D()
        );
        if (nearChar) {
          this.debriefPanel.open(nearChar);
        }
      }
    });

    // Prevent context menu on right click
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  private animate(): void {
    if (!this.isRunning) return;

    requestAnimationFrame(() => this.animate());

    const deltaTime = this.clock.getDelta();

    // Update game state (only if dialog not open)
    if (!this.debriefPanel.isShowing()) {
      this.player.update(deltaTime);
      this.characterManager.update(deltaTime);

      // Check for nearby characters
      const nearChar = this.characterManager.isPlayerNearCharacter(
        this.player.getPosition2D()
      );
      
      if (nearChar) {
        this.prompt.show(nearChar.getDisplayName());
      } else {
        this.prompt.hide();
      }
    }

    // Render
    this.renderer.render(this.scene, this.player.camera);
  }
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ConnectorOffice();
});
