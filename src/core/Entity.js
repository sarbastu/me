import { event } from './Event.js';
import { Vector2 } from './Vector2.js';

export class Entity {
  constructor({ position = new Vector2(0, 0) } = {}) {
    this.position = position.clone();
    this.children = new Set();
    this.parent = null;
  }

  addChild(gameObject) {
    if (gameObject === this) throw new Error('Cannot add self as a child.');
    gameObject.parent = this;
    this.children.add(gameObject);
    gameObject.onAdd();
  }

  removeChild(gameObject) {
    this.children.delete(gameObject);
    if (gameObject.parent === this) gameObject.parent = null;
    gameObject.onRemove();
  }

  updateAll(delta) {
    this.children.forEach((child) => child.updateAll(delta));
    this.update(delta);
  }

  drawAll(ctx, offsetX = 0, offsetY = 0) {
    const worldX = this.position.x + offsetX;
    const worldY = this.position.y + offsetY;

    this.draw(ctx, worldX, worldY);
    this.children.forEach((child) => child.drawAll(ctx, worldX, worldY));
  }

  destroy() {
    event.unsubscribe(this);
    this.children.forEach((child) => {
      child.destroy();
    });
    this.parent.removeChild(this);
  }

  onAdd() {
    // Override in subclasses for custom behavior
  }

  onRemove() {
    // Override in subclasses for custom behavior
  }

  update(_delta) {
    // Override in subclasses for custom behavior
  }

  draw(ctx, x, y) {
    // Override in subclasses for custom behavior
  }
}
