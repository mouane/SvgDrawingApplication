import { Injectable } from '@angular/core';
import { DIALOG_SAVE } from 'src/app/enum';
import { Drawing } from '../../../../../common/communication/drawing';

@Injectable({
    providedIn: 'root',
})
export class DialogPopupSaveDrawingProperties {
    drawingObject: Drawing;
    prompter = DIALOG_SAVE.PROMPTER;
    minLenghtMess = DIALOG_SAVE.MIN_LENGTH_MESS;
    maxLenghtMess = DIALOG_SAVE.MAX_LENGTH_MESS;
    pattern =  DIALOG_SAVE.PATTERN_MESS;

}
