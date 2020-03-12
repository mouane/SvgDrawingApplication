import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PenToolProperties {
    linePath: string;
    lines: SVGElement;
    circle: SVGElement;
    circleX: number;
    circleY: number;
    pathX: number;
    pathY: number;
    startX: number;
    startY: number;
    color: string;
    hasStarted = false;
    tipMax = 30;
    tipMin = 10;
    timeStamp = 0;
    lastMouseX: number;
    lastMouseY: number;
    timePresent: number;
    differenceTime: number;
    differenceX: number;
    differenceY: number;
    speedX: number;
    speedY: number;
    tipSizeWithSpeedPrevious: number;
    tipSizeWithSpeedCurrent: number;
    subSvg: SVGElement;
}
