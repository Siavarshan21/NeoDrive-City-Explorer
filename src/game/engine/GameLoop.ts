/**
 * GameLoop - Provides a fixed-timestep game loop with delta time.
 * Use this for systems that need consistent update timing
 * (physics, AI, etc.) independent of frame rate.
 */

export type UpdateCallback = (deltaTime: number, elapsedTime: number) => void;

class GameLoop {
  private callbacks: UpdateCallback[] = [];
  private lastTime = 0;
  private elapsedTime = 0;
  private running = false;
  private animFrameId: number | null = null;

  /** Maximum delta time (cap to prevent spiral of death) */
  private maxDelta = 1 / 15; // ~66ms

  /** Register an update callback */
  subscribe(callback: UpdateCallback) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  /** Start the game loop */
  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now() / 1000;
    this.tick();
  }

  /** Stop the game loop */
  stop() {
    this.running = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  /** Check if the loop is running */
  get isRunning(): boolean {
    return this.running;
  }

  /** Get total elapsed time */
  get totalElapsed(): number {
    return this.elapsedTime;
  }

  private tick = () => {
    if (!this.running) return;

    const now = performance.now() / 1000;
    let deltaTime = now - this.lastTime;
    this.lastTime = now;

    // Cap delta time to prevent physics instability
    if (deltaTime > this.maxDelta) {
      deltaTime = this.maxDelta;
    }

    this.elapsedTime += deltaTime;

    // Call all registered update callbacks
    for (const callback of this.callbacks) {
      callback(deltaTime, this.elapsedTime);
    }

    this.animFrameId = requestAnimationFrame(this.tick);
  };
}

/** Singleton game loop instance */
export const gameLoop = new GameLoop();
