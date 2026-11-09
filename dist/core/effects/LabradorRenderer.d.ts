export interface LabradorOptions {
    scale?: number;
    imageSrc?: string;
}
export declare class LabradorRenderer {
    private scale;
    private x;
    private y;
    private targetWidth;
    private targetHeight;
    private image;
    private isImageLoaded;
    private chewPhase;
    private breathPhase;
    private sparkleTimer;
    private currentAlpha;
    private targetAlpha;
    private bowlCanvas;
    private bowlOffsetX;
    private bowlOffsetY;
    private crumbs;
    private sparkles;
    constructor(options?: number | LabradorOptions);
    private loadImage;
    init(height: number): void;
    private preRenderSweetsBowl;
    update(mouseX: number, mouseY: number, dt?: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    clear(): void;
}
