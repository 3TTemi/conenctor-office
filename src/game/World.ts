import * as THREE from 'three';

/**
 * Creates the Minecraft-style voxel office world.
 * Uses blocky geometry, pixel-like textures, and a grass/dirt/wood palette.
 */
export class World {
  private scene: THREE.Scene;
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.buildWorld();
  }

  private buildWorld(): void {
    this.createFloor();
    this.createWalls();
    this.createFurniture();
    this.createDecorations();
    this.createLighting();
  }

  private createFloor(): void {
    // Main grass floor
    const grassGeometry = new THREE.BoxGeometry(30, 0.5, 30);
    const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x4a8f29 });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.position.set(0, -0.25, 0);
    grass.receiveShadow = true;
    this.scene.add(grass);

    // Dirt layer underneath (visible at edges)
    const dirtGeometry = new THREE.BoxGeometry(32, 1, 32);
    const dirtMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const dirt = new THREE.Mesh(dirtGeometry, dirtMaterial);
    dirt.position.set(0, -1, 0);
    this.scene.add(dirt);

    // Stone foundation
    const stoneGeometry = new THREE.BoxGeometry(34, 0.5, 34);
    const stoneMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    stone.position.set(0, -1.75, 0);
    this.scene.add(stone);

    // Indoor wooden floor area
    const woodFloorGeometry = new THREE.BoxGeometry(20, 0.1, 20);
    const woodMaterial = new THREE.MeshLambertMaterial({ color: 0xDEB887 });
    const woodFloor = new THREE.Mesh(woodFloorGeometry, woodMaterial);
    woodFloor.position.set(0, 0.05, 2);
    woodFloor.receiveShadow = true;
    this.scene.add(woodFloor);

    // Wood plank pattern (simple stripes)
    for (let i = -9; i <= 9; i += 2) {
      const plankLine = new THREE.BoxGeometry(20, 0.02, 0.1);
      const darkWood = new THREE.MeshLambertMaterial({ color: 0xA0522D });
      const line = new THREE.Mesh(plankLine, darkWood);
      line.position.set(0, 0.12, i + 2);
      this.scene.add(line);
    }
  }

  private createWalls(): void {
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xD2B48C }); // Tan/sandstone
    const wallHeight = 4;
    const wallThickness = 0.5;

    // Back wall
    const backWall = new THREE.BoxGeometry(24, wallHeight, wallThickness);
    const back = new THREE.Mesh(backWall, wallMaterial);
    back.position.set(0, wallHeight / 2, -8);
    back.castShadow = true;
    this.scene.add(back);

    // Side walls (partial - office is open air Minecraft style)
    const sideGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, 8);
    
    const leftWall = new THREE.Mesh(sideGeometry, wallMaterial);
    leftWall.position.set(-12, wallHeight / 2, -4);
    leftWall.castShadow = true;
    this.scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideGeometry, wallMaterial);
    rightWall.position.set(12, wallHeight / 2, -4);
    rightWall.castShadow = true;
    this.scene.add(rightWall);

    // Wall trim (darker wood)
    const trimMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trimGeometry = new THREE.BoxGeometry(24.5, 0.3, 0.6);
    const topTrim = new THREE.Mesh(trimGeometry, trimMaterial);
    topTrim.position.set(0, wallHeight + 0.15, -8);
    this.scene.add(topTrim);

    const bottomTrim = new THREE.Mesh(trimGeometry, trimMaterial);
    bottomTrim.position.set(0, 0.15, -8);
    this.scene.add(bottomTrim);

    // Windows (glass blocks)
    const glassMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x87CEEB, 
      transparent: true, 
      opacity: 0.5 
    });
    
    for (let x = -8; x <= 8; x += 4) {
      const windowGeometry = new THREE.BoxGeometry(2, 2, 0.2);
      const windowMesh = new THREE.Mesh(windowGeometry, glassMaterial);
      windowMesh.position.set(x, 2.5, -7.8);
      this.scene.add(windowMesh);

      // Window frame
      const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
      const frameTop = new THREE.BoxGeometry(2.3, 0.15, 0.25);
      const frameTopMesh = new THREE.Mesh(frameTop, frameMaterial);
      frameTopMesh.position.set(x, 3.6, -7.75);
      this.scene.add(frameTopMesh);

      const frameBottom = new THREE.Mesh(frameTop, frameMaterial);
      frameBottom.position.set(x, 1.4, -7.75);
      this.scene.add(frameBottom);
    }
  }

  private createFurniture(): void {
    // Desks for each character area
    this.createDesk(-6, -5);  // Gmail area
    this.createDesk(6, -5);   // Calendar area
    this.createDesk(-6, 3);   // Notion area
    this.createDesk(6, 3);    // Drive area
    this.createDesk(0, 6);    // GitHub area (center back)

    // Bookshelves
    this.createBookshelf(-10, -6);
    this.createBookshelf(10, -6);

    // Plants
    this.createPlant(-3, -6);
    this.createPlant(3, -6);
    this.createPlant(-8, 8);
    this.createPlant(8, 8);

    // Center meeting table
    this.createMeetingTable(0, 0);

    // Coffee station
    this.createCoffeeStation(10, 8);
  }

  private createDesk(x: number, z: number): void {
    const woodMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    
    // Desk top
    const topGeometry = new THREE.BoxGeometry(3, 0.2, 1.5);
    const top = new THREE.Mesh(topGeometry, woodMaterial);
    top.position.set(x, 1, z);
    top.castShadow = true;
    this.scene.add(top);

    // Desk legs
    const legGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
    const positions = [
      [x - 1.3, 0.5, z - 0.6],
      [x + 1.3, 0.5, z - 0.6],
      [x - 1.3, 0.5, z + 0.6],
      [x + 1.3, 0.5, z + 0.6],
    ];
    
    positions.forEach(([px, py, pz]) => {
      const leg = new THREE.Mesh(legGeometry, woodMaterial);
      leg.position.set(px, py, pz);
      leg.castShadow = true;
      this.scene.add(leg);
    });

    // Computer monitor (blocky)
    const monitorMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const screenMaterial = new THREE.MeshLambertMaterial({ color: 0x4a90d9 });
    
    const monitorBase = new THREE.BoxGeometry(0.4, 0.1, 0.3);
    const base = new THREE.Mesh(monitorBase, monitorMaterial);
    base.position.set(x, 1.15, z);
    this.scene.add(base);

    const monitorStand = new THREE.BoxGeometry(0.1, 0.4, 0.1);
    const stand = new THREE.Mesh(monitorStand, monitorMaterial);
    stand.position.set(x, 1.35, z);
    this.scene.add(stand);

    const monitorScreen = new THREE.BoxGeometry(1, 0.7, 0.1);
    const screen = new THREE.Mesh(monitorScreen, monitorMaterial);
    screen.position.set(x, 1.85, z);
    this.scene.add(screen);

    const screenFace = new THREE.BoxGeometry(0.9, 0.6, 0.05);
    const face = new THREE.Mesh(screenFace, screenMaterial);
    face.position.set(x, 1.85, z + 0.075);
    this.scene.add(face);
  }

  private createBookshelf(x: number, z: number): void {
    const woodMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    
    // Frame
    const frame = new THREE.BoxGeometry(1.5, 3, 0.5);
    const shelf = new THREE.Mesh(frame, woodMaterial);
    shelf.position.set(x, 1.5, z);
    shelf.castShadow = true;
    this.scene.add(shelf);

    // Books (colorful blocks)
    const bookColors = [0xE74C3C, 0x3498DB, 0x2ECC71, 0xF39C12, 0x9B59B6];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const bookMaterial = new THREE.MeshLambertMaterial({ 
          color: bookColors[(row + col) % bookColors.length] 
        });
        const bookGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.35);
        const book = new THREE.Mesh(bookGeometry, bookMaterial);
        book.position.set(x - 0.4 + col * 0.4, 0.5 + row * 0.9, z + 0.1);
        this.scene.add(book);
      }
    }
  }

  private createPlant(x: number, z: number): void {
    // Pot
    const potMaterial = new THREE.MeshLambertMaterial({ color: 0xCD853F });
    const potGeometry = new THREE.BoxGeometry(0.6, 0.5, 0.6);
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.set(x, 0.25, z);
    pot.castShadow = true;
    this.scene.add(pot);

    // Dirt in pot
    const dirtMaterial = new THREE.MeshLambertMaterial({ color: 0x4a3728 });
    const dirtGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.5);
    const potDirt = new THREE.Mesh(dirtGeometry, dirtMaterial);
    potDirt.position.set(x, 0.55, z);
    this.scene.add(potDirt);

    // Leaves (stacked green blocks)
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const leafGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.8);
    
    for (let i = 0; i < 3; i++) {
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.set(x, 0.75 + i * 0.25, z);
      leaf.rotation.y = i * 0.3;
      this.scene.add(leaf);
    }
  }

  private createMeetingTable(x: number, z: number): void {
    const woodMaterial = new THREE.MeshLambertMaterial({ color: 0xA0522D });
    
    // Table top
    const tableTop = new THREE.BoxGeometry(4, 0.2, 2);
    const top = new THREE.Mesh(tableTop, woodMaterial);
    top.position.set(x, 0.8, z);
    top.castShadow = true;
    this.scene.add(top);

    // Table legs
    const legGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
    const legPositions = [
      [x - 1.7, 0.4, z - 0.7],
      [x + 1.7, 0.4, z - 0.7],
      [x - 1.7, 0.4, z + 0.7],
      [x + 1.7, 0.4, z + 0.7],
    ];
    
    legPositions.forEach(([px, py, pz]) => {
      const leg = new THREE.Mesh(legGeometry, woodMaterial);
      leg.position.set(px, py, pz);
      leg.castShadow = true;
      this.scene.add(leg);
    });

    // Chairs around table
    this.createChair(x - 2.5, z);
    this.createChair(x + 2.5, z);
    this.createChair(x, z - 1.5);
    this.createChair(x, z + 1.5);
  }

  private createChair(x: number, z: number): void {
    const woodMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const cushionMaterial = new THREE.MeshLambertMaterial({ color: 0xDC143C });

    // Seat
    const seatGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.6);
    const seat = new THREE.Mesh(seatGeometry, woodMaterial);
    seat.position.set(x, 0.5, z);
    this.scene.add(seat);

    // Cushion
    const cushionGeometry = new THREE.BoxGeometry(0.5, 0.08, 0.5);
    const cushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
    cushion.position.set(x, 0.59, z);
    this.scene.add(cushion);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.08, 0.5, 0.08);
    const legPositions = [
      [x - 0.22, 0.25, z - 0.22],
      [x + 0.22, 0.25, z - 0.22],
      [x - 0.22, 0.25, z + 0.22],
      [x + 0.22, 0.25, z + 0.22],
    ];
    
    legPositions.forEach(([px, py, pz]) => {
      const leg = new THREE.Mesh(legGeometry, woodMaterial);
      leg.position.set(px, py, pz);
      this.scene.add(leg);
    });

    // Back
    const backGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const back = new THREE.Mesh(backGeometry, woodMaterial);
    back.position.set(x, 0.85, z - 0.3);
    this.scene.add(back);
  }

  private createCoffeeStation(x: number, z: number): void {
    // Counter
    const counterMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
    const counterGeometry = new THREE.BoxGeometry(2, 1, 1);
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.set(x, 0.5, z);
    counter.castShadow = true;
    this.scene.add(counter);

    // Counter top (lighter)
    const topMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
    const topGeometry = new THREE.BoxGeometry(2.1, 0.1, 1.1);
    const counterTop = new THREE.Mesh(topGeometry, topMaterial);
    counterTop.position.set(x, 1.05, z);
    this.scene.add(counterTop);

    // Coffee machine (blocky)
    const machineMaterial = new THREE.MeshLambertMaterial({ color: 0x2F2F2F });
    const machineGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.4);
    const machine = new THREE.Mesh(machineGeometry, machineMaterial);
    machine.position.set(x - 0.5, 1.4, z);
    this.scene.add(machine);

    // Coffee cups
    const cupMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    for (let i = 0; i < 3; i++) {
      const cupGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.15);
      const cup = new THREE.Mesh(cupGeometry, cupMaterial);
      cup.position.set(x + 0.3 + i * 0.25, 1.2, z);
      this.scene.add(cup);
    }
  }

  private createDecorations(): void {
    // Outdoor grass patches with variation
    const grassVariants = [0x4a8f29, 0x3d7a22, 0x5ba033];
    
    for (let i = 0; i < 30; i++) {
      const material = new THREE.MeshLambertMaterial({ 
        color: grassVariants[Math.floor(Math.random() * grassVariants.length)] 
      });
      const geometry = new THREE.BoxGeometry(
        0.3 + Math.random() * 0.3,
        0.1 + Math.random() * 0.2,
        0.3 + Math.random() * 0.3
      );
      const patch = new THREE.Mesh(geometry, material);
      
      // Only place outside the wood floor area
      let px, pz;
      do {
        px = (Math.random() - 0.5) * 28;
        pz = (Math.random() - 0.5) * 28;
      } while (Math.abs(px) < 11 && pz > -9 && pz < 13);
      
      patch.position.set(px, 0.1, pz);
      this.scene.add(patch);
    }

    // Flowers
    const flowerColors = [0xFF6B6B, 0xFFE66D, 0x4ECDC4, 0xC44DFF];
    for (let i = 0; i < 15; i++) {
      const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      const material = new THREE.MeshLambertMaterial({ color });
      const geometry = new THREE.BoxGeometry(0.2, 0.3, 0.2);
      const flower = new THREE.Mesh(geometry, material);
      
      let px, pz;
      do {
        px = (Math.random() - 0.5) * 26;
        pz = (Math.random() - 0.5) * 26;
      } while (Math.abs(px) < 10 && pz > -8 && pz < 12);
      
      flower.position.set(px, 0.2, pz);
      this.scene.add(flower);
    }

    // Trees at corners
    this.createTree(-13, -10);
    this.createTree(13, -10);
    this.createTree(-13, 12);
    this.createTree(13, 12);
  }

  private createTree(x: number, z: number): void {
    // Trunk
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunkGeometry = new THREE.BoxGeometry(0.8, 3, 0.8);
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 1.5, z);
    trunk.castShadow = true;
    this.scene.add(trunk);

    // Leaves (stacked blocks like Minecraft)
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const leafPositions = [
      [0, 3.5, 0, 2],
      [0, 4, 0, 1.5],
      [0, 4.5, 0, 1],
    ];

    leafPositions.forEach(([ox, oy, oz, size]) => {
      const leafGeometry = new THREE.BoxGeometry(size, 0.8, size);
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      leaf.position.set(x + ox, oy, z + oz);
      leaf.castShadow = true;
      this.scene.add(leaf);
    });
  }

  private createLighting(): void {
    // Ambient light (soft fill)
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);

    // Main directional light (sun)
    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(10, 20, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 50;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    this.scene.add(sun);

    // Hemisphere light for sky/ground bounce
    const hemi = new THREE.HemisphereLight(0x87CEEB, 0x4a8f29, 0.3);
    this.scene.add(hemi);
  }
}
