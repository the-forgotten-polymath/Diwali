export interface HangingLantern {
    baseX: number;
    x: number;
    y: number;
    stringLength: number;
    width: number;
    height: number;
    swayPhase: number;
    swaySpeed: number;
    swayMaxAngle: number;
    swayAngle: number;
    glowPhase: number;
    paletteIndex: number;
    primaryColor: string;
    accentColor: string;
    currentAlpha: number;
    targetAlpha: number;
}
export declare class HangingLanternsRenderer {
    private lanterns;
    private count;
    private fadeRadius;
    private spriteCanvases;
    constructor(count?: number);
    private preRenderSprites;
    init(width: number): void;
    update(mouseX: number, mouseY: number, dt?: number): void;
    render(ctx: CanvasRenderingContext2D): void;
    clear(): void;
}
