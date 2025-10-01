export class UpdateLoop {
  constructor(update, render, timeStep = 1000 / 60) {
    this.update = update;
    this.render = render;

    this.lastFrameTime = 0;
    this.timeStep = timeStep / 1000; //converting timestep to seconds
    this.accumulatedTime = 0;

    this.rafID = null;
    this.isRunning = false;
  }

  loop(timeStamp) {
    if (!this.isRunning) return;

    this.deltaTime = timeStamp - this.lastFrameTime;
    this.lastFrameTime = timeStamp;

    this.accumulatedTime += this.deltaTime;

    if (this.accumulatedTime >= this.timeStep) {
      this.update(this.timeStep);
      this.accumulatedTime = this.accumulatedTime % this.timeStep;
    }

    this.render();

    this.rafID = requestAnimationFrame(this.loop.bind(this));
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.rafID = requestAnimationFrame(this.loop.bind(this));
    }
  }

  stop() {
    if (this.rafID) {
      cancelAnimationFrame(this.rafID);
    }
    this.isRunning = false;
  }
}
