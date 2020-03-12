import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ResizeProperties {
    refX: number;
    refY: number;

    isFirstScale: boolean;

    renderer: Renderer2;

    bboxSelect: DOMRect;

    scaleXenable = false;
    scaleYenable = false;

    translateX: string;
    translateY: string;

    isMirrorX = false;
    isMirrorY = false;

    shiftenable: boolean;

    cumulScaleX: number;
    cumulScaleY: number;

  controlPoint: string;
}
