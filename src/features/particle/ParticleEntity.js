import { Entity } from '../../core/Entity.js';
import { event } from '../../core/Event.js';
import { Vector2 } from '../../core/Vector2.js';

export class ParticleEntity extends Entity {
  constructor({
    position,
    origin,
    appearance = {},
    physics = {},
    behaviour = {},
  }) {
    super({ position: position });
    this.origin = origin ?? this.position.clone();
    this.color = appearance.color ?? 'rgba(255, 255, 255, 0.5)';
    this.radius = appearance.radius ?? 1;
    this.mass = physics.mass ?? 1;
    this.velocity = physics.velocity ?? new Vector2(0, 0);
    this.friction = physics.friction ?? 0.98;
    this.acceleration = new Vector2(0, 0);
    this.lifespan = behaviour.lifespan ?? 100;
    this.drawnToOrigin = behaviour.drawnToOrigin ?? false;
    this.randomMovement = behaviour.randomMovement ?? false;
    this.shootingStar = behaviour.shootingStar ?? false;
    this.autoBoundingBox = behaviour.autoBoundingBox ?? false;
    this.input = behaviour.input ?? null;
    this.mouseInteractions = behaviour.mouseInteractions ?? false;
    this.boundingBox = behaviour.boundingBox ?? [
      -Infinity,
      -Infinity,
      Infinity,
      Infinity,
    ];

    if (this.mouseInteractions) this.enableMouseInteractions();

    if (behaviour.autoBoundingBox) this.enableAutoBoundingBox();
  }

  enableMouseInteractions() {
    event.on('mouse-down', this, (e) => {
      this.moveAwayFrom(e, 10000000, 100000);
    });
  }

  enableAutoBoundingBox() {
    event.on('RESIZED_CANVAS', this, (e) => {
      this.boundingBox = [0, 0, e.width, e.height];
    });
  }

  applyForce(force = new Vector2(0, 0)) {
    this.acceleration.add(force.divide(this.mass));
  }

  isOutOfBounds() {
    const [x, y, maxX, maxY] = this.boundingBox;
    let outOfBounds = false;
    if (this.position.x < x || this.position.x > maxX) {
      outOfBounds = true;
    } else if (this.position.y < y || this.position.y > maxY) {
      outOfBounds = true;
    }
    return outOfBounds;
  }

  isDead() {
    return this.lifespan <= 0 || this.isOutOfBounds();
  }

  moveTowards(position, radius = 10000, force = 0.01) {
    const dx = position.x - this.position.x;
    const dy = position.y - this.position.y;
    const distanceSquared = dx * dx + dy * dy;

    if (distanceSquared < radius) {
      const springForce = force * distanceSquared;
      const angle = Math.atan2(dy, dx);
      const accelerationX = Math.cos(angle) * springForce;
      const accelerationY = Math.sin(angle) * springForce;
      this.applyForce(new Vector2(accelerationX, accelerationY));
    }
  }

  moveAwayFrom(position, radius = 10000, force = 100000) {
    const dx = this.position.x - position.x;
    const dy = this.position.y - position.y;
    const distanceSquared = dx * dx + dy * dy;
    if (distanceSquared < radius) {
      const angle = Math.atan2(dy, dx);
      const totalForce = force / distanceSquared;
      const accelerationX = Math.cos(angle) * totalForce;
      const accelerationY = Math.sin(angle) * totalForce;
      this.applyForce(new Vector2(accelerationX, accelerationY));
    }
  }

  updateBehaviours() {
    if (this.randomMovement) this.applyForce();
    if (this.drawnToOrigin) this.moveTowards(this.origin, Infinity);
    if (this.shootingStar && this.lifespan < 2) {
      this.drawnToOrigin = false;
      this.acceleration.add(new Vector2(500, 500));
    }
    if (this.mouseInteractions && this.input) {
      this.moveAwayFrom(this.input.relativeMousePosition, 100000, 1000000);
    }
  }

  updateVelocity(delta) {
    this.velocity.add(this.acceleration.clone().multiply(delta));
    this.velocity.multiply(this.friction);
    this.position.add(this.velocity.clone().multiply(delta));
    this.acceleration.set(0, 0);
  }

  update(delta) {
    if (this.isDead()) {
      this.destroy();
      return;
    }
    this.updateBehaviours();
    this.updateVelocity(delta);

    this.lifespan -= delta;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
