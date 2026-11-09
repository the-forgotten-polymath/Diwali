export declare class MouseTracker {
    x: number;
    y: number;
    isDown: boolean;
    isMoving: boolean;
    speed: number;
    private lastX;
    private lastY;
    private moveTimeout;
    private clickListeners;
    private moveListeners;
    constructor(targetElement?: HTMLElement | Window);
    private handleMouseMove;
    private handleTouchMove;
    private handleMouseDown;
    private handleMouseUp;
    private handleTouchStart;
    private handleTouchEnd;
    private handleClick;
    private updateMotion;
    onMove(cb: (x: number, y: number) => void): () => void;
    onClick(cb: (x: number, y: number, event: MouseEvent | TouchEvent) => void): () => void;
    destroy(): void;
}
