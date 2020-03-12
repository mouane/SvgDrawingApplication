import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PipetteProperties {
    color: string;
    xPos: number;
    yPos: number;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    ellipseRange: number;
    centerX = 0;
    centerY = 0;
    newPointsX = new Array();
    newPointsY = new Array();
}
