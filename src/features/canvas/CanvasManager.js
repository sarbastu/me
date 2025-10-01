import { event } from '../../core/Event.js';
import { Vector2 } from '../../core/Vector2.js';

export class CanvasManager {
  constructor({ canvasID, width, height }) {
    this.canvas = document.getElementById(canvasID);
    this.ctx = this.canvas.getContext('2d');
    this.width = width ?? document.body.scrollWidth;
    this.height = height ?? document.body.scrollHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.resizeCanvas = this.resizeCanvas.bind(this);
  }

  get center() {
    const x = this.width / 2;
    const y = this.height / 2;
    return new Vector2(x, y);
  }

  enableAutoResize() {
    event.on('RESIZE', this, this.resizeCanvas);
  }

  disableAutoResize() {
    event.off('RESIZE', this, this.resizeCanvas);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  fadeCanvas(color) {
    this.ctx.fillStyle = color || 'rgba(0, 0, 0, 0.01)';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  resizeCanvas() {
    this.width = document.body.scrollWidth;
    this.height = document.body.scrollHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    event.emit('RESIZED_CANVAS', { width: this.width, height: this.height });
  }
}
