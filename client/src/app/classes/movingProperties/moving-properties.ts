import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class MovingProperties {
    selectedChilds: Node[] = [];
    refX: number;
    refY: number;
    firstTime = true;
}
