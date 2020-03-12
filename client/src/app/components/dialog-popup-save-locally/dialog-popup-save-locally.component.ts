import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DIALOG_SAVE_LOCAL } from 'src/app/enum';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { Drawing } from '../../../../../common/communication/drawing';

@Component({
  selector: 'app-dialog-popup-save-locally',
  templateUrl: './dialog-popup-save-locally.component.html',
  styleUrls: ['./dialog-popup-save-locally.component.scss'],
})
export class DialogPopupSaveLocallyComponent implements OnInit {
  private localDrawing = '';

  constructor(private saveDrawingService: SaveDrawingService, public dialogRef: MatDialogRef<DialogPopupSaveLocallyComponent>,
              private hotkey: HotkeysService, private renderer: Renderer2) { }

  @ViewChild(DIALOG_SAVE_LOCAL.SAVE, { static: false }) save: ElementRef;
  prompter = DIALOG_SAVE_LOCAL.PROMPTER;
  maxLenghtMess = DIALOG_SAVE_LOCAL.MAX_LENGTH_MESS;
  patternErrorMess = DIALOG_SAVE_LOCAL.PATTERN_ERROR_MESS;
  specialChar = /^[a-zA-Z0-9!@#$%^&*()]+$/;
  nameControl = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50),
                                Validators.pattern(this.specialChar)]));

  ngOnInit() {
    this.hotkey.popupActive = true;
  }

  getErrorMessageName(): string {
    return this.nameControl.hasError(DIALOG_SAVE_LOCAL.REQUIRED) ? this.prompter :
      this.nameControl.hasError(DIALOG_SAVE_LOCAL.PATTERN) ? this.patternErrorMess :
      this.nameControl.hasError(DIALOG_SAVE_LOCAL.MAX_LENGTH) ? this.maxLenghtMess : '';
  }

  formatFile(filename: string): void {
    let drawingObject: Drawing;
    drawingObject = this.saveDrawingService.saveDrawingLocally(filename);
    this.localDrawing += drawingObject.drawingHeight;
    this.localDrawing += DIALOG_SAVE_LOCAL.COMMA + drawingObject.drawingWidth;
    this.localDrawing += DIALOG_SAVE_LOCAL.COMMA + drawingObject.drawingColor;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < drawingObject.childList.length; i++) {
      this.localDrawing += DIALOG_SAVE_LOCAL.COMMA + drawingObject.childList[i];
    }
    this.download(filename);
  }

  download(filename: string): void {
    const element = this.renderer.createElement(DIALOG_SAVE_LOCAL.A);

    element.setAttribute(DIALOG_SAVE_LOCAL.HREF, DIALOG_SAVE_LOCAL.URL + encodeURIComponent(this.localDrawing));
    element.setAttribute(DIALOG_SAVE_LOCAL.DOWNLOAD, filename);

    element.style.display = DIALOG_SAVE_LOCAL.NONE;
    this.renderer.appendChild(this.save.nativeElement, element);

    element.click();
    this.renderer.removeChild(this.save, element);
    this.dialogClose();
  }

  dialogClose(): void {
    this.dialogRef.close();
    this.hotkey.popupActive = false;
  }
}
