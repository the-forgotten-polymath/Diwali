export class MouseTracker {
  public x = 0;
  public y = 0;
  public isDown = false;
  public isMoving = false;
  public speed = 0;
  private lastX = 0;
  private lastY = 0;
  private moveTimeout: number | null = null;
  private clickListeners: Array<(x: number, y: number, event: MouseEvent | TouchEvent) => void> = [];
  private moveListeners: Array<(x: number, y: number) => void> = [];

  constructor(targetElement: HTMLElement | Window = window) {
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.lastX = this.x;
    this.lastY = this.y;

    targetElement.addEventListener('mousemove', this.handleMouseMove as EventListener, { passive: true });
    targetElement.addEventListener('mousedown', this.handleMouseDown as EventListener, { passive: true });
    targetElement.addEventListener('mouseup', this.handleMouseUp as EventListener, { passive: true });
    targetElement.addEventListener('click', this.handleClick as EventListener);

    targetElement.addEventListener('touchmove', this.handleTouchMove as EventListener, { passive: true });
    targetElement.addEventListener('touchstart', this.handleTouchStart as EventListener, { passive: true });
    targetElement.addEventListener('touchend', this.handleTouchEnd as EventListener, { passive: true });
  }

  private handleMouseMove = (e: MouseEvent): void => {
    this.x = e.clientX;
    this.y = e.clientY;
    this.updateMotion();
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (e.touches.length > 0) {
      this.x = e.touches[0].clientX;
      this.y = e.touches[0].clientY;
      this.updateMotion();
    }
  };

  private handleMouseDown = (): void => {
    this.isDown = true;
  };

  private handleMouseUp = (): void => {
    this.isDown = false;
  };

  private handleTouchStart = (e: TouchEvent): void => {
    this.isDown = true;
    if (e.touches.length > 0) {
      this.x = e.touches[0].clientX;
      this.y = e.touches[0].clientY;
    }
  };

  private handleTouchEnd = (): void => {
    this.isDown = false;
  };

  private handleClick = (e: MouseEvent | TouchEvent): void => {
    // Ignore clicks on UI buttons and controls
    const target = e.target as HTMLElement | null;
    if (target && target.closest('button, input, select, a, .control-dock, .side-panel')) {
      return;
    }

    const clientX = 'clientX' in e ? e.clientX : (e as TouchEvent).changedTouches?.[0]?.clientX ?? this.x;
    const clientY = 'clientY' in e ? e.clientY : (e as TouchEvent).changedTouches?.[0]?.clientY ?? this.y;
    for (const listener of this.clickListeners) {
      listener(clientX, clientY, e);
    }
  };

  private updateMotion(): void {
    const dx = this.x - this.lastX;
    const dy = this.y - this.lastY;
    this.speed = Math.sqrt(dx * dx + dy * dy);
    this.lastX = this.x;
    this.lastY = this.y;
    this.isMoving = true;

    for (const l of this.moveListeners) {
      l(this.x, this.y);
    }

    if (this.moveTimeout) {
      window.clearTimeout(this.moveTimeout);
    }
    this.moveTimeout = window.setTimeout(() => {
      this.isMoving = false;
      this.speed = 0;
    }, 100);
  }

  public onMove(cb: (x: number, y: number) => void): () => void {
    this.moveListeners.push(cb);
    return () => {
      this.moveListeners = this.moveListeners.filter((l) => l !== cb);
    };
  }

  public onClick(cb: (x: number, y: number, event: MouseEvent | TouchEvent) => void): () => void {
    this.clickListeners.push(cb);
    return () => {
      this.clickListeners = this.clickListeners.filter((l) => l !== cb);
    };
  }

  public destroy(): void {
    window.removeEventListener('mousemove', this.handleMouseMove as EventListener);
    window.removeEventListener('mousedown', this.handleMouseDown as EventListener);
    window.removeEventListener('mouseup', this.handleMouseUp as EventListener);
    window.removeEventListener('click', this.handleClick as EventListener);
    window.removeEventListener('touchmove', this.handleTouchMove as EventListener);
    window.removeEventListener('touchstart', this.handleTouchStart as EventListener);
    window.removeEventListener('touchend', this.handleTouchEnd as EventListener);
    if (this.moveTimeout) {
      window.clearTimeout(this.moveTimeout);
    }
    this.clickListeners = [];
    this.moveListeners = [];
  }
}

