import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Drawing } from '../../../../../common/communication/drawing';

@Injectable({
    providedIn: 'root',
})
export class OpenDrawingProperties {
    includes = false;
    exists = false;
    loading = true;
    tag = false;
    fileChosen = false;
    errorFound = false;

    paragraph: HTMLElement;
    theSelectedDrawing: Drawing;
    drawingsList: Drawing[];
    showDrawings: Drawing[] = [];
    tagsList: string[] = [];
    selectedTags: string[];
    drawing: SafeUrl[] = [];
    drawingFiltered: SafeUrl[] = [];
}
