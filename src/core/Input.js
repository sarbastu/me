import { event } from './Event.js';
import { Vector2 } from './Vector2.js';

export class Input {
  constructor(targetElement = document) {
    this.targetElement = targetElement;

    this.mouse = {
      position: new Vector2(0, 0),
      pressed: new Set(),
      dragStart: new Vector2(0, 0),
    };

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  get mousePosition() {
    return this.mouse.position.clone();
  }

  get relativeMousePosition() {
    return this.mouse.position
      .clone()
      .add(new Vector2(window.scrollX, window.scrollY));
  }

  get isDragging() {
    return this.mouse.pressed.size > 0;
  }

  handleMouseMove(e) {
    this.mouse.position.set(e.clientX, e.clientY);
    if (this.isDragging) {
      event.emit('drag', this.relativeMousePosition, this.dragStart);
    }
  }

  handleMouseDown(e) {
    this.mouse.pressed.add(e.button);
    if (this.isDragging) {
      this.mouse.dragStart = this.relativeMousePosition.clone();
      event.emit('drag-start', this.relativeMousePosition);
    }
    event.emit('mouse-down', this.relativeMousePosition);
  }

  handleMouseUp(e) {
    this.mouse.pressed.delete(e.button);
    if (this.isDragging) {
      event.emit('drag-end', this.mouse.dragStart, this.relativeMousePosition);
    }
  }

  resetState() {
    this.mouse.pressed.clear();
  }

  enableMouse() {
    this.targetElement.addEventListener('mousemove', this.handleMouseMove);
    this.targetElement.addEventListener('mousedown', this.handleMouseDown);
    this.targetElement.addEventListener('mouseup', this.handleMouseUp);
    this.targetElement.addEventListener('mouseleave', this.resetState);
    window.addEventListener('blur', this.resetState);
  }

  disableMouse() {
    this.targetElement.removeEventListener('mousemove', this.handleMouseMove);
    this.targetElement.removeEventListener('mousedown', this.handleMouseDown);
    this.targetElement.removeEventListener('mouseup', this.handleMouseUp);
    this.targetElement.removeEventListener('mouseleave', this.resetState);
    window.removeEventListener('blur', this.resetState);
  }
}
