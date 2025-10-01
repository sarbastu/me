import { Vector2 } from '../../core/Vector2.js';
import { ParticleEntity } from './ParticleEntity.js';

export class ParticleGenerator {
  constructor(config = {}) {
    this.defaultConfig = {
      position: new Vector2(0, 0),
      width: 500,
      height: 500,
      amount: 0,
      ...config,
    };
  }

  makeParticle(config = {}) {
    const finalConfig = { ...this.defaultConfig, ...config };
    const particle = new ParticleEntity({
      ...finalConfig,
    });
    return particle;
  }

  makeStars(config = {}) {
    const finalConfig = {
      ...this.defaultConfig,
      ...config,
    };
    const particles = [];
    for (let i = 0; i < finalConfig.amount; i++) {
      const position = new Vector2(
        Math.random() * finalConfig.width,
        Math.random() * finalConfig.height
      );

      particles.push(
        this.makeParticle({
          position: position,
          origin: position.clone(),
          appearance: {
            color: `rgba(32, 104, 187, 0.5)`,
            radius: Math.random() + 0.1,
          },
          behaviour: {
            lifespan: Math.random() * 15000,
            shootingStar: true,
            drawnToOrigin: true,
            mouseInteractions: true,
            input: finalConfig.input || null,
            autoBoundingBox: true,
          },
        })
      );
    }
    return particles;
  }
}
