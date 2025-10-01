import { CanvasManager } from '../features/canvas/CanvasManager.js';
import { Input } from '../core/Input.js';
import { UpdateLoop } from '../core/UpdateLoop.js';
import { Entity } from '../core/Entity.js';
import { ParticleGenerator } from '../features/particle/ParticleGenerator.js';
import { event } from '../core/Event.js';

export class Main {
  constructor({ canvasID }) {
    this.canvas = new CanvasManager({ canvasID });
    this.loop = new UpdateLoop(this.update.bind(this), this.render.bind(this));
    this.generator = new ParticleGenerator();

    this.input = new Input();
    this.input.enableMouse();

    this.scene = new Entity();
  }

  addParticles(amount = this.canvas.width + this.canvas.height) {
    const particles = this.generator.makeStars({
      amount: amount - this.scene.children.size,
      width: this.canvas.width,
      height: this.canvas.height,
      input: this.input,
    });

    particles.forEach((particle) => this.scene.addChild(particle));
  }

  update(delta) {
    this.addParticles();
    this.scene.updateAll(delta);
  }

  render() {
    this.canvas.clearCanvas();
    this.scene.drawAll(this.canvas.ctx);
  }

  addEventListeners() {
    window.addEventListener('resize', (e) => {
      event.emit('RESIZE');
    });
  }

  init() {
    this.addEventListeners();
    this.canvas.enableAutoResize();
    this.addParticles();
    this.loop.start();
  }
}
