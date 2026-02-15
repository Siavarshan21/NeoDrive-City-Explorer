/**
 * InputManager - Centralized keyboard and mouse input tracking.
 * Maintains a set of currently pressed keys and mouse movement deltas.
 * Used by PlayerController and VehicleController to read input state each frame.
 */

export interface InputState {
  keys: Set<string>;
  mouseX: number;
  mouseY: number;
  mouseButtons: Set<number>;
  isPointerLocked: boolean;
}

class InputManager {
  private state: InputState = {
    keys: new Set(),
    mouseX: 0,
    mouseY: 0,
    mouseButtons: new Set(),
    isPointerLocked: false,
  };

  private mouseDeltaX = 0;
  private mouseDeltaY = 0;
  private initialized = false;

  /** Initialize event listeners on the document */
  init() {
    if (this.initialized || typeof window === 'undefined') return;

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    document.addEventListener('pointerlockerror', this.onPointerLockError);

    this.initialized = true;
  }

  /** Clean up event listeners */
  dispose() {
    if (typeof window === 'undefined') return;

    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    document.removeEventListener('pointerlockerror', this.onPointerLockError);

    this.initialized = false;
  }

  /** Check if a key code is currently pressed */
  isKeyDown(code: string): boolean {
    return this.state.keys.has(code);
  }

  /** Get and reset mouse movement delta since last call */
  getMouseDelta(): { x: number; y: number } {
    const delta = { x: this.mouseDeltaX, y: this.mouseDeltaY };
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    return delta;
  }

  /** Check if pointer is locked */
  get isPointerLocked(): boolean {
    return this.state.isPointerLocked;
  }

  /** Request pointer lock on the canvas element */
  requestPointerLock(element: HTMLElement) {
    try {
      // Only request if document is focused and no existing lock
      if (document.hasFocus() && !document.pointerLockElement) {
        element.requestPointerLock();
      }
    } catch (err) {
      console.warn('Failed to request pointer lock:', err);
    }
  }

  /** Exit pointer lock */
  exitPointerLock() {
    document.exitPointerLock();
  }

  /** Get a snapshot of current input state */
  getState(): Readonly<InputState> {
    return this.state;
  }

  // -- Event handlers --

  private onKeyDown = (e: KeyboardEvent) => {
    this.state.keys.add(e.code);
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.state.keys.delete(e.code);
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.state.isPointerLocked) {
      this.mouseDeltaX += e.movementX;
      this.mouseDeltaY += e.movementY;
    }
    this.state.mouseX = e.clientX;
    this.state.mouseY = e.clientY;
  };

  private onMouseDown = (e: MouseEvent) => {
    this.state.mouseButtons.add(e.button);
  };

  private onMouseUp = (e: MouseEvent) => {
    this.state.mouseButtons.delete(e.button);
  };

  private onPointerLockChange = () => {
    this.state.isPointerLocked = document.pointerLockElement !== null;
  };

  private onPointerLockError = () => {
    console.warn('Pointer lock request failed. Click on the canvas when focused to enable mouse look.');
  };
}

/** Singleton instance of InputManager */
export const inputManager = new InputManager();
