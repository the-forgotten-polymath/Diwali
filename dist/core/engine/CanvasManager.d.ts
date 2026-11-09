export declare class CanvasManager {
    private canvas;
    private ctx;
    private isCreatedInternally;
    private parentContainer;
    private resizeObserver;
    private onResizeCallbacks;
    width: number;
    height: number;
    dpr: number;
    private customDpr?;
    constructor(customCanvas?: HTMLCanvasElement | null, container?: HTMLElement | null, zIndex?: number, dpr?: number);
    getCanvas(): HTMLCanvasElement;
    getContext(): CanvasRenderingContext2D;
    onResize(cb: (width: number, height: number, dpr: number) => void): () => void;
    private updateDimensions;
    private setupListeners;
    clear(): void;
    destroy(): void;
}
