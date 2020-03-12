import { Injectable, Renderer2} from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoProperties {
    drawingView: SVGElement;
    actions: SVGElement[] = [];
    renderer: Renderer2;
    itterator = 0;
    drawingDiv: HTMLElement;
    grid: SVGElement;
    hexSubcribe: Subscription;
    onChange = false;
    isClone = false;
    config = {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: ['fill', 'stroke'],
    };
}
