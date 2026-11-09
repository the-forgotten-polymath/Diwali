export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isCreatedInternally = false;
  private parentContainer: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private onResizeCallbacks: Array<(width: number, height: number, dpr: number) => void> = [];

  public width = 0;
  public height = 0;
  public dpr = 1;

  private customDpr?: number;

  constructor(customCanvas?: HTMLCanvasElement | null, container?: HTMLElement | null, zIndex = 9999, dpr?: number) {
    this.customDpr = dpr;
    if (customCanvas) {
      this.canvas = customCanvas;
      this.isCreatedInternally = false;
    } else {
      this.canvas = document.createElement('canvas');
      this.isCreatedInternally = true;
      this.canvas.style.position = container ? 'absolute' : 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = String(zIndex);
      this.canvas.setAttribute('aria-hidden', 'true');
      this.canvas.setAttribute('role', 'presentation');

      this.parentContainer = container || document.body;
      this.parentContainer.appendChild(this.canvas);
    }

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('[diwali-animations] Unable to obtain 2D rendering context from canvas.');
    }
    this.ctx = context;

    this.updateDimensions();
    this.setupListeners();
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public onResize(cb: (width: number, height: number, dpr: number) => void): () => void {
    this.onResizeCallbacks.push(cb);
    return () => {
      this.onResizeCallbacks = this.onResizeCallbacks.filter((c) => c !== cb);
    };
  }

  private updateDimensions = (): void => {
    this.dpr = this.customDpr !== undefined
      ? this.customDpr
      : Math.min(window.devicePixelRatio || 1, 1.5); // Cap at 1.5 for buttery 120 FPS performance

    let displayWidth = window.innerWidth;
    let displayHeight = window.innerHeight;

    if (this.parentContainer && this.parentContainer !== document.body) {
      const rect = this.parentContainer.getBoundingClientRect();
      displayWidth = rect.width;
      displayHeight = rect.height;
    } else if (!this.isCreatedInternally) {
      displayWidth = this.canvas.clientWidth || window.innerWidth;
      displayHeight = this.canvas.clientHeight || window.innerHeight;
    }

    this.width = displayWidth;
    this.height = displayHeight;

    this.canvas.width = Math.floor(displayWidth * this.dpr);
    this.canvas.height = Math.floor(displayHeight * this.dpr);

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    for (const cb of this.onResizeCallbacks) {
      cb(this.width, this.height, this.dpr);
    }
  };

  private setupListeners(): void {
    window.addEventListener('resize', this.updateDimensions);

    if (typeof ResizeObserver !== 'undefined' && this.parentContainer && this.parentContainer !== document.body) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateDimensions();
      });
      this.resizeObserver.observe(this.parentContainer);
    }
  }

  public clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  public destroy(): void {
    window.removeEventListener('resize', this.updateDimensions);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.onResizeCallbacks = [];

    if (this.isCreatedInternally && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

