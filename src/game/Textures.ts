import * as THREE from 'three';

/**
 * Procedural Minecraft-style pixel texture generator.
 * Creates 16x16 textures with nearest-neighbor filtering.
 */
export class TextureGenerator {
  private static cache: Map<string, THREE.CanvasTexture> = new Map();

  private static createTexture(width: number, height: number, painter: (ctx: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    painter(ctx);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  static grassTop(): THREE.CanvasTexture {
    if (this.cache.has('grassTop')) return this.cache.get('grassTop')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = '#5D9B3C';
      ctx.fillRect(0, 0, 16, 16);
      
      const greens = ['#4A8F29', '#6BAA4F', '#528F35', '#73B556', '#4D9030'];
      for (let i = 0; i < 60; i++) {
        ctx.fillStyle = greens[Math.floor(Math.random() * greens.length)];
        const x = Math.floor(Math.random() * 16);
        const y = Math.floor(Math.random() * 16);
        ctx.fillRect(x, y, 1, 1);
      }
    });
    this.cache.set('grassTop', tex);
    return tex;
  }

  static grassSide(): THREE.CanvasTexture {
    if (this.cache.has('grassSide')) return this.cache.get('grassSide')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(0, 0, 16, 16);
      
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#7A5A10' : '#9C7A1C';
        ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
      }
      
      ctx.fillStyle = '#5D9B3C';
      ctx.fillRect(0, 0, 16, 3);
      for (let x = 0; x < 16; x++) {
        const depth = Math.floor(Math.random() * 2) + 2;
        for (let y = 3; y < depth + 2; y++) {
          if (Math.random() > 0.5) {
            ctx.fillStyle = ['#4A8F29', '#5D9B3C', '#6BAA4F'][Math.floor(Math.random() * 3)];
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    });
    this.cache.set('grassSide', tex);
    return tex;
  }

  static dirt(): THREE.CanvasTexture {
    if (this.cache.has('dirt')) return this.cache.get('dirt')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(0, 0, 16, 16);
      
      const dirts = ['#7A5A10', '#9C7A1C', '#6B4A08', '#A8862A'];
      for (let i = 0; i < 80; i++) {
        ctx.fillStyle = dirts[Math.floor(Math.random() * dirts.length)];
        ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
      }
    });
    this.cache.set('dirt', tex);
    return tex;
  }

  static oakPlanks(): THREE.CanvasTexture {
    if (this.cache.has('oakPlanks')) return this.cache.get('oakPlanks')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = '#BA945A';
      ctx.fillRect(0, 0, 16, 16);
      
      ctx.fillStyle = '#9A7A4A';
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 4, 16, 1);
      ctx.fillRect(0, 8, 16, 1);
      ctx.fillRect(0, 12, 16, 1);
      
      const browns = ['#A88450', '#C9A86A', '#8A6A3A'];
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = browns[Math.floor(Math.random() * browns.length)];
        ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
      }
    });
    this.cache.set('oakPlanks', tex);
    return tex;
  }

  static stone(): THREE.CanvasTexture {
    if (this.cache.has('stone')) return this.cache.get('stone')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = '#7F7F7F';
      ctx.fillRect(0, 0, 16, 16);
      
      const grays = ['#6A6A6A', '#8F8F8F', '#5A5A5A', '#9A9A9A', '#707070'];
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = grays[Math.floor(Math.random() * grays.length)];
        const x = Math.floor(Math.random() * 16);
        const y = Math.floor(Math.random() * 16);
        ctx.fillRect(x, y, Math.random() > 0.7 ? 2 : 1, Math.random() > 0.7 ? 2 : 1);
      }
    });
    this.cache.set('stone', tex);
    return tex;
  }

  static stoneBricks(): THREE.CanvasTexture {
    if (this.cache.has('stoneBricks')) return this.cache.get('stoneBricks')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = '#7A7A7A';
      ctx.fillRect(0, 0, 16, 16);
      
      ctx.fillStyle = '#5A5A5A';
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 7, 16, 1);
      ctx.fillRect(7, 0, 1, 8);
      ctx.fillRect(0, 8, 1, 8);
      ctx.fillRect(15, 8, 1, 8);
      
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#6A6A6A' : '#8A8A8A';
        ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
      }
    });
    this.cache.set('stoneBricks', tex);
    return tex;
  }

  static glass(): THREE.CanvasTexture {
    if (this.cache.has('glass')) return this.cache.get('glass')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = 'rgba(200, 230, 255, 0.3)';
      ctx.fillRect(0, 0, 16, 16);
      
      ctx.fillStyle = 'rgba(180, 210, 240, 0.5)';
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 15, 16, 1);
      ctx.fillRect(0, 0, 1, 16);
      ctx.fillRect(15, 0, 1, 16);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(1, 1, 2, 2);
    });
    this.cache.set('glass', tex);
    return tex;
  }

  static oakLog(): THREE.CanvasTexture {
    if (this.cache.has('oakLog')) return this.cache.get('oakLog')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = '#6B5034';
      ctx.fillRect(0, 0, 16, 16);
      
      ctx.fillStyle = '#5A4028';
      for (let y = 0; y < 16; y += 2) {
        ctx.fillRect(0, y, 16, 1);
      }
      
      const browns = ['#5A4028', '#7C6040', '#4A3020'];
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = browns[Math.floor(Math.random() * browns.length)];
        ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
      }
    });
    this.cache.set('oakLog', tex);
    return tex;
  }

  static oakLogTop(): THREE.CanvasTexture {
    if (this.cache.has('oakLogTop')) return this.cache.get('oakLogTop')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = '#6B5034';
      ctx.fillRect(0, 0, 16, 16);
      
      ctx.fillStyle = '#BA945A';
      ctx.fillRect(2, 2, 12, 12);
      
      ctx.fillStyle = '#9A7A4A';
      ctx.fillRect(4, 4, 8, 8);
      
      ctx.fillStyle = '#7A5A3A';
      ctx.fillRect(6, 6, 4, 4);
    });
    this.cache.set('oakLogTop', tex);
    return tex;
  }

  static craftingTableTop(): THREE.CanvasTexture {
    if (this.cache.has('craftingTableTop')) return this.cache.get('craftingTableTop')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = '#BA945A';
      ctx.fillRect(0, 0, 16, 16);
      
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 0, 1, 16);
      ctx.fillRect(15, 0, 1, 16);
      ctx.fillRect(0, 15, 16, 1);
      
      ctx.fillStyle = '#9A7A4A';
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          ctx.fillRect(2 + i * 4, 2 + j * 4, 3, 3);
        }
      }
    });
    this.cache.set('craftingTableTop', tex);
    return tex;
  }

  static craftingTableSide(): THREE.CanvasTexture {
    if (this.cache.has('craftingTableSide')) return this.cache.get('craftingTableSide')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = '#BA945A';
      ctx.fillRect(0, 0, 16, 16);
      
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(0, 0, 16, 1);
      
      ctx.fillStyle = '#6B4A08';
      ctx.fillRect(3, 4, 4, 8);
      ctx.fillRect(9, 4, 4, 8);
      
      ctx.fillStyle = '#9C7A1C';
      ctx.fillRect(4, 5, 2, 6);
      ctx.fillRect(10, 5, 2, 6);
    });
    this.cache.set('craftingTableSide', tex);
    return tex;
  }

  static chestFront(): THREE.CanvasTexture {
    if (this.cache.has('chestFront')) return this.cache.get('chestFront')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(0, 0, 16, 16);
      
      ctx.fillStyle = '#6B4A08';
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 0, 1, 16);
      ctx.fillRect(15, 0, 1, 16);
      ctx.fillRect(0, 15, 16, 1);
      
      ctx.fillStyle = '#2A2A2A';
      ctx.fillRect(6, 5, 4, 4);
      
      ctx.fillStyle = '#4A4A4A';
      ctx.fillRect(7, 6, 2, 2);
    });
    this.cache.set('chestFront', tex);
    return tex;
  }

  static chestSide(): THREE.CanvasTexture {
    if (this.cache.has('chestSide')) return this.cache.get('chestSide')!;
    
    const tex = this.createTexture(16, 16, (ctx) => {
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(0, 0, 16, 16);
      
      ctx.fillStyle = '#6B4A08';
      ctx.fillRect(0, 0, 16, 1);
      ctx.fillRect(0, 0, 1, 16);
      ctx.fillRect(15, 0, 1, 16);
      ctx.fillRect(0, 15, 16, 1);
      
      for (let i = 0; i < 15; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#7A5A10' : '#9C7A1C';
        ctx.fillRect(Math.floor(Math.random() * 14) + 1, Math.floor(Math.random() * 14) + 1, 1, 1);
      }
    });
    this.cache.set('chestSide', tex);
    return tex;
  }

  static torch(): THREE.CanvasTexture {
    if (this.cache.has('torch')) return this.cache.get('torch')!;
    
    const tex = this.createTexture(8, 16, (ctx) => {
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, 8, 16);
      
      ctx.fillStyle = '#6B5034';
      ctx.fillRect(3, 4, 2, 12);
      
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(2, 1, 4, 4);
      
      ctx.fillStyle = '#FF8C00';
      ctx.fillRect(3, 2, 2, 2);
    });
    this.cache.set('torch', tex);
    return tex;
  }

  static steveHead(): THREE.CanvasTexture {
    if (this.cache.has('steveHead')) return this.cache.get('steveHead')!;
    
    const tex = this.createTexture(8, 8, (ctx) => {
      ctx.fillStyle = '#B5956A';
      ctx.fillRect(0, 0, 8, 8);
      
      ctx.fillStyle = '#6B4423';
      ctx.fillRect(0, 0, 8, 2);
      ctx.fillRect(0, 0, 1, 4);
      ctx.fillRect(7, 0, 1, 4);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(1, 3, 2, 1);
      ctx.fillRect(5, 3, 2, 1);
      
      ctx.fillStyle = '#4A3728';
      ctx.fillRect(2, 3, 1, 1);
      ctx.fillRect(5, 3, 1, 1);
      
      ctx.fillStyle = '#8B6954';
      ctx.fillRect(3, 5, 2, 1);
    });
    this.cache.set('steveHead', tex);
    return tex;
  }

  static createMaterial(texture: THREE.CanvasTexture, transparent: boolean = false): THREE.MeshLambertMaterial {
    return new THREE.MeshLambertMaterial({
      map: texture,
      transparent,
      alphaTest: transparent ? 0.1 : 0,
    });
  }

  static createBoxMaterials(
    top: THREE.CanvasTexture,
    bottom: THREE.CanvasTexture,
    sides: THREE.CanvasTexture
  ): THREE.MeshLambertMaterial[] {
    return [
      this.createMaterial(sides),
      this.createMaterial(sides),
      this.createMaterial(top),
      this.createMaterial(bottom),
      this.createMaterial(sides),
      this.createMaterial(sides),
    ];
  }
}
