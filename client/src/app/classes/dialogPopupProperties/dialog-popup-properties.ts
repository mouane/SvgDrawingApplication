import { Injectable } from '@angular/core';
import { DIALOG_POPUP } from '../../enum';

@Injectable({
    providedIn: 'root',
})

export class DialopPopupProperties {
    height: number;
    length: number;
    hex: string;
    options = true;
    prompter = DIALOG_POPUP.PROMPTER;
    lengthMin = DIALOG_POPUP.LENGTH_MIN;
    lengthMax = DIALOG_POPUP.LENGTH_MAX;
    heightMin = DIALOG_POPUP.HEIGTH_MIN;
    heightMax = DIALOG_POPUP.HEIGTH_MAX;
    numberOnly = DIALOG_POPUP.NUMBER_ONLY;
    betweenD = DIALOG_POPUP.BETWEEND;
    betweenU = DIALOG_POPUP.BETWEENU;
    backgroundHex: string = DIALOG_POPUP.BACKGROUND;
}
