import { Component, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DialogPopupSaveDrawingProperties } from 'src/app/classes/dialogPopupSaveDrawingProperties/dialogPopupSaveDrawingProperties';
import { DIALOG_SAVE } from 'src/app/enum';
import { SafePipe } from 'src/app/pipe/safe.pipe';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { Drawing } from '../../../../../common/communication/drawing';

@Component({
  selector: 'app-dialog-popup-save-drawing',
  templateUrl: './dialog-popup-save-drawing.component.html',
  styleUrls: ['./dialog-popup-save-drawing.component.scss'],
})
export class DialogPopupSaveDrawingComponent implements OnInit {
  constructor( private saveDrawing: SaveDrawingService,
               public dialogRef: MatDialogRef<DialogPopupSaveDrawingComponent>,
               private hotkey: HotkeysService,
               private safepipehtmlurl: SafePipe,
               private properties: DialogPopupSaveDrawingProperties,
              ) { }
  svg: SVGElement = this.saveDrawing.getSVGElement();
  svg64: string = this.saveDrawing.svgImage(this.svg);
  miniDrawing = this.safepipehtmlurl.transform(this.svg64);
  nameControl = new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)]));
  tagControl = new FormControl('', Validators.compose([Validators.pattern(DIALOG_SAVE.PATTERN_NUMBER)]));

  ngOnInit() {
    this.hotkey.popupActive = true;
   }

  getErrorMessageName(): string {
    return this.nameControl.hasError(DIALOG_SAVE.REQUIRED) ? this.properties.prompter :
    this.nameControl.hasError(DIALOG_SAVE.MAX_LENGTH) ? this.properties.maxLenghtMess : DIALOG_SAVE.NULL;
  }
  getErrorMessageTag(): string {
    return this.tagControl.hasError(DIALOG_SAVE.PATTERN) ? this.properties.pattern : DIALOG_SAVE.NULL ;
  }
  sendDrawing(): void {
    this.saveDrawing.sendDrawingData(this.nameControl.value, this.tagControl.value).subscribe(
      (drawing: Drawing) => {
        this.properties.drawingObject = drawing;
      }, (error: any) => console.log(DIALOG_SAVE.LOG + error.status));
    this.saveDrawing.sendToFireBase(this.saveDrawing.encodeSvgToFireBase(this.svg), this.nameControl.value);
    this.dialogClose();
  }
  dialogClose(): void {
    this.dialogRef.close();
    this.hotkey.popupActive = false;
  }
}
