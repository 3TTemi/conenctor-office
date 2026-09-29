import * as THREE from 'three';
import { TextureGenerator } from './Textures';

/**
 * Creates a Minecraft-style voxel office world with pixel textures.
 */
export class World {
  private scene: THREE.Scene;
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.buildWorld();
  }

  private buildWorld(): void {
    this.createSky();
    this.createGround();
    this.createFloor();
    this.createWalls();
    this.createFurniture();
    this.createTorches();
    this.createDecorations();
    this.createLighting();
  }

  private createSky(): void {
    const skyGeo = new THREE.BoxGeometry(200, 200, 200);
    const skyColors = [
      new THREE.Color(0x87CEEB),
      new THREE.Color(0x87CEEB),
      new THREE.Color(0x6BB3E0),
      new THREE.Color(0x5BA3D0),
      new THREE.Color(0x87CEEB),
      new THREE.Color(0x87CEEB),
    ];
    
    const skyMats = skyColors.map(color => 
      new THREE.MeshBasicMaterial({ color, side: THREE.BackSide })
    );
    
    const sky = new THREE.Mesh(skyGeo, skyMats);
    sky.position.y = 50;
    this.scene.add(sky);

    const sunGeo = new THREE.BoxGeometry(8, 8, 1);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xFFFF88 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(40, 60, -80);
    sun.lookAt(0, 0, 0);
    this.scene.add(sun);
  }

  private createGround(): void {
    const grassTopMat = TextureGenerator.createMaterial(TextureGenerator.grassTop());
    const grassSideMat = TextureGenerator.createMaterial(TextureGenerator.grassSide());
    const dirtMat = TextureGenerator.createMaterial(TextureGenerator.dirt());
    const stoneMat = TextureGenerator.createMaterial(TextureGenerator.stone());

    for (let x = -20; x <= 20; x += 1) {
      for (let z = -15; z <= 20; z += 1) {
        if (Math.abs(x) <= 10 && z >= -7 && z <= 12) continue;
        
        const grassMats = [
          grassSideMat, grassSideMat,
          grassTopMat, dirtMat,
          grassSideMat, grassSideMat,
        ];
        
        const grassGeo = new THREE.BoxGeometry(1, 1, 1);
        const grass = new THREE.Mesh(grassGeo, grassMats);
        grass.position.set(x, -0.5, z);
        grass.receiveShadow = true;
        this.scene.add(grass);
      }
    }

    for (let x = -22; x <= 22; x += 1) {
      for (let z = -17; z <= 22; z += 1) {
        const dirtGeo = new THREE.BoxGeometry(1, 1, 1);
        const dirt = new THREE.Mesh(dirtGeo, dirtMat);
        dirt.position.set(x, -1.5, z);
        this.scene.add(dirt);

        const stoneGeo = new THREE.BoxGeometry(1, 1, 1);
        const stone = new THREE.Mesh(stoneGeo, stoneMat);
        stone.position.set(x, -2.5, z);
        this.scene.add(stone);
      }
    }
  }

  private createFloor(): void {
    const planksMat = TextureGenerator.createMaterial(TextureGenerator.oakPlanks());
    
    for (let x = -10; x <= 10; x++) {
      for (let z = -7; z <= 12; z++) {
        const plankGeo = new THREE.BoxGeometry(1, 0.2, 1);
        const plank = new THREE.Mesh(plankGeo, planksMat);
        plank.position.set(x, -0.1, z);
        plank.receiveShadow = true;
        this.scene.add(plank);
      }
    }
  }

  private createWalls(): void {
    const stoneBricksMat = TextureGenerator.createMaterial(TextureGenerator.stoneBricks());
    const oakLogMat = TextureGenerator.createMaterial(TextureGenerator.oakLog());
    const glassMat = TextureGenerator.createMaterial(TextureGenerator.glass(), true);

    for (let x = -10; x <= 10; x++) {
      for (let y = 0; y < 5; y++) {
        if (y >= 1 && y <= 3 && x >= -8 && x <= 8 && (x % 3 === 0 || x % 3 === 1)) {
          const glassGeo = new THREE.BoxGeometry(1, 1, 0.2);
          const glass = new THREE.Mesh(glassGeo, glassMat);
          glass.position.set(x, y + 0.5, -7.4);
          this.scene.add(glass);
        } else {
          const brickGeo = new THREE.BoxGeometry(1, 1, 1);
          const brick = new THREE.Mesh(brickGeo, stoneBricksMat);
          brick.position.set(x, y + 0.5, -7);
          brick.castShadow = true;
          this.scene.add(brick);
        }
      }
    }

    for (let x = -11; x <= 11; x += 22) {
      for (let z = -7; z <= 5; z++) {
        for (let y = 0; y < 5; y++) {
          const brickGeo = new THREE.BoxGeometry(1, 1, 1);
          const brick = new THREE.Mesh(brickGeo, stoneBricksMat);
          brick.position.set(x, y + 0.5, z);
          brick.castShadow = true;
          this.scene.add(brick);
        }
      }
    }

    const corners = [[-11, -7], [11, -7], [-11, 5], [11, 5]];
    corners.forEach(([x, z]) => {
      for (let y = 0; y < 6; y++) {
        const logGeo = new THREE.BoxGeometry(1, 1, 1);
        const log = new THREE.Mesh(logGeo, oakLogMat);
        log.position.set(x, y + 0.5, z);
        log.castShadow = true;
        this.scene.add(log);
      }
    });
  }

  private createFurniture(): void {
    this.createDesk(-6, -4);
    this.createDesk(6, -4);
    this.createDesk(-6, 4);
    this.createDesk(6, 4);
    this.createDesk(0, 7);

    this.createChest(-9, -5);
    this.createChest(9, -5);
    this.createChest(-9, 10);
    this.createChest(9, 10);

    this.createCraftingTable(0, 0);
  }

  private createDesk(x: number, z: number): void {
    const planksMat = TextureGenerator.createMaterial(TextureGenerator.oakPlanks());
    const craftTopMat = TextureGenerator.createMaterial(TextureGenerator.craftingTableTop());
    const craftSideMat = TextureGenerator.createMaterial(TextureGenerator.craftingTableSide());

    const topMats = [
      craftSideMat, craftSideMat,
      craftTopMat, planksMat,
      craftSideMat, craftSideMat,
    ];
    
    const topGeo = new THREE.BoxGeometry(3, 1, 2);
    const top = new THREE.Mesh(topGeo, topMats);
    top.position.set(x, 1, z);
    top.castShadow = true;
    this.scene.add(top);

    const legPositions = [
      [x - 1, z - 0.5],
      [x + 1, z - 0.5],
      [x - 1, z + 0.5],
      [x + 1, z + 0.5],
    ];

    const oakLogMat = TextureGenerator.createMaterial(TextureGenerator.oakLog());
    legPositions.forEach(([lx, lz]) => {
      const legGeo = new THREE.BoxGeometry(0.3, 0.5, 0.3);
      const leg = new THREE.Mesh(legGeo, oakLogMat);
      leg.position.set(lx, 0.25, lz);
      leg.castShadow = true;
      this.scene.add(leg);
    });

    const monitorGeo = new THREE.BoxGeometry(1.5, 1, 0.2);
    const blackMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const monitor = new THREE.Mesh(monitorGeo, blackMat);
    monitor.position.set(x, 2, z);
    this.scene.add(monitor);

    const screenGeo = new THREE.BoxGeometry(1.3, 0.8, 0.05);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x4488cc });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(x, 2, z + 0.1);
    this.scene.add(screen);
  }

  private createChest(x: number, z: number): void {
    const chestFrontMat = TextureGenerator.createMaterial(TextureGenerator.chestFront());
    const chestSideMat = TextureGenerator.createMaterial(TextureGenerator.chestSide());

    const chestMats = [
      chestSideMat, chestSideMat,
      chestSideMat, chestSideMat,
      chestFrontMat, chestSideMat,
    ];

    const chestGeo = new THREE.BoxGeometry(1, 1, 1);
    const chest = new THREE.Mesh(chestGeo, chestMats);
    chest.position.set(x, 0.5, z);
    chest.castShadow = true;
    this.scene.add(chest);
  }

  private createCraftingTable(x: number, z: number): void {
    const craftTopMat = TextureGenerator.createMaterial(TextureGenerator.craftingTableTop());
    const craftSideMat = TextureGenerator.createMaterial(TextureGenerator.craftingTableSide());
    const planksMat = TextureGenerator.createMaterial(TextureGenerator.oakPlanks());

    const tableMats = [
      craftSideMat, craftSideMat,
      craftTopMat, planksMat,
      craftSideMat, craftSideMat,
    ];

    const tableGeo = new THREE.BoxGeometry(2, 1, 2);
    const table = new THREE.Mesh(tableGeo, tableMats);
    table.position.set(x, 0.5, z);
    table.castShadow = true;
    this.scene.add(table);
  }

  private createTorches(): void {
    const torchPositions = [
      [-10, 2.5, -6.5],
      [10, 2.5, -6.5],
      [-10, 2.5, 4],
      [10, 2.5, 4],
      [0, 2.5, 11],
    ];

    const oakLogMat = TextureGenerator.createMaterial(TextureGenerator.oakLog());
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xFFAA00 });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xFFDD44 });

    torchPositions.forEach(([x, y, z]) => {
      const stickGeo = new THREE.BoxGeometry(0.15, 0.6, 0.15);
      const stick = new THREE.Mesh(stickGeo, oakLogMat);
      stick.position.set(x, y, z);
      this.scene.add(stick);

      const flameGeo = new THREE.BoxGeometry(0.2, 0.3, 0.2);
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(x, y + 0.4, z);
      this.scene.add(flame);

      const glowGeo = new THREE.BoxGeometry(0.1, 0.15, 0.1);
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.set(x, y + 0.5, z);
      this.scene.add(glow);

      const light = new THREE.PointLight(0xFFAA44, 0.8, 8);
      light.position.set(x, y + 0.5, z);
      this.scene.add(light);
    });
  }

  private createDecorations(): void {
    const oakLogMat = TextureGenerator.createMaterial(TextureGenerator.oakLog());
    const oakLogTopMat = TextureGenerator.createMaterial(TextureGenerator.oakLogTop());

    const treePositions = [[-15, -12], [15, -12], [-15, 16], [15, 16]];
    
    treePositions.forEach(([x, z]) => {
      for (let y = 0; y < 4; y++) {
        const logMats = [
          oakLogMat, oakLogMat,
          oakLogTopMat, oakLogTopMat,
          oakLogMat, oakLogMat,
        ];
        const logGeo = new THREE.BoxGeometry(1, 1, 1);
        const log = new THREE.Mesh(logGeo, logMats);
        log.position.set(x, y + 0.5, z);
        log.castShadow = true;
        this.scene.add(log);
      }

      const leafMat = new THREE.MeshLambertMaterial({ color: 0x2D5A1D });
      const leafPositions = [
        [0, 4, 0], [1, 4, 0], [-1, 4, 0], [0, 4, 1], [0, 4, -1],
        [1, 4, 1], [1, 4, -1], [-1, 4, 1], [-1, 4, -1],
        [0, 5, 0], [1, 5, 0], [-1, 5, 0], [0, 5, 1], [0, 5, -1],
        [0, 6, 0],
      ];
      
      leafPositions.forEach(([lx, ly, lz]) => {
        const leafGeo = new THREE.BoxGeometry(1, 1, 1);
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(x + lx, ly + 0.5, z + lz);
        leaf.castShadow = true;
        this.scene.add(leaf);
      });
    });

    const flowerColors = [0xFF6B6B, 0xFFE66D, 0x4ECDC4, 0xFF69B4];
    for (let i = 0; i < 20; i++) {
      let fx: number, fz: number;
      do {
        fx = Math.floor(Math.random() * 40) - 20;
        fz = Math.floor(Math.random() * 35) - 15;
      } while (Math.abs(fx) <= 11 && fz >= -8 && fz <= 13);

      const stemMat = new THREE.MeshLambertMaterial({ color: 0x228B22 });
      const stemGeo = new THREE.BoxGeometry(0.1, 0.4, 0.1);
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(fx, 0.2, fz);
      this.scene.add(stem);

      const petalMat = new THREE.MeshLambertMaterial({ 
        color: flowerColors[Math.floor(Math.random() * flowerColors.length)]
      });
      const petalGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(fx, 0.5, fz);
      this.scene.add(petal);
    }

    for (let i = 0; i < 30; i++) {
      let gx: number, gz: number;
      do {
        gx = Math.floor(Math.random() * 40) - 20;
        gz = Math.floor(Math.random() * 35) - 15;
      } while (Math.abs(gx) <= 11 && gz >= -8 && gz <= 13);

      const tallGrassMat = new THREE.MeshLambertMaterial({ 
        color: Math.random() > 0.5 ? 0x3D7A22 : 0x4A8F29 
      });
      const tallGrassGeo = new THREE.BoxGeometry(0.1, 0.3 + Math.random() * 0.2, 0.1);
      const tallGrass = new THREE.Mesh(tallGrassGeo, tallGrassMat);
      tallGrass.position.set(gx + Math.random() * 0.5, 0.2, gz + Math.random() * 0.5);
      this.scene.add(tallGrass);
    }
  }

  private createLighting(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(20, 40, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 100;
    sun.shadow.camera.left = -30;
    sun.shadow.camera.right = 30;
    sun.shadow.camera.top = 30;
    sun.shadow.camera.bottom = -30;
    this.scene.add(sun);

    const hemi = new THREE.HemisphereLight(0x87CEEB, 0x4a8f29, 0.3);
    this.scene.add(hemi);
  }
}
