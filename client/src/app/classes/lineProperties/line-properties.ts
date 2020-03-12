import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class LineProperties {
    linePath: string;
    currentLine: string;
    previousLine: string;
    arrayLinePaths: string[];
    color: string;
    startPathId: string;
    junctionType = 'round';
    lineType: string;
    isDot = false;
    dotSize = 5;
    pathX: number;
    pathY: number;
    currentX: number;
    currentY: number;
    startX: number;
    startY: number;
    lines: SVGElement;
    circle: SVGElement;
    circles: SVGElement[];
    circleX: number;
    circleY: number;
    keyBack: KeyType;
    tip = 5;
    indexPath = 0;
    indexCircle = 0;
    indexLinePaths = 0;
    subSvg: SVGElement;
}
