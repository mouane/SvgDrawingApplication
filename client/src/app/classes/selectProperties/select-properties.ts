import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SelectToolProperties {
    eraserParams: HTMLElement;
    stampParams: HTMLElement;
    pipetteParams: HTMLElement;
    bucketParams: HTMLElement;
    gridParams: HTMLElement;
    lineParams: HTMLElement;
    airBrushParams: HTMLElement;
    brushParams: HTMLElement;
    pencilParams: HTMLElement;
    shapeParams: HTMLElement;
    selectionParams: HTMLElement;
    textParams: HTMLElement;
    penParams: HTMLElement;
    quillParams: HTMLElement;

    tools: HTMLElement;
    params: HTMLElement;
}
