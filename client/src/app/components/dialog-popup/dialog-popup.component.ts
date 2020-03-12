import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { DialopPopupProperties } from 'src/app/classes/dialogPopupProperties/dialog-popup-properties';
import { ColorPickerComponent } from 'src/app/components/color-picker/color-picker.component';
import { DIALOG_POPUP } from 'src/app/enum';
import { ColorToolService } from 'src/app/services/color-tool/color-tool.service';
import { ConfigureDrawingSizeService } from 'src/app/services/configure-drawing-size/configure-drawing-size';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { MouseControlService } from 'src/app/services/mouse-control/mouse-control.service';
@Component({
  selector: 'app-dialog-popup',
  templateUrl: './dialog-popup.component.html',
  styleUrls: ['./dialog-popup.component.scss'],
})
export class DialogPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogPopupComponent>,
              @Inject(MAT_DIALOG_DATA)public data: any, private drawingCanvas: ConfigureDrawingSizeService,
              private colorToolService: ColorToolService, private hotkey: HotkeysService, private mouseServ: MouseControlService,
              private colorPicker: ColorPickerComponent, private colorProperties: ColorToolProperties,
              private dialogPopup: DialopPopupProperties) {
             }

  @Output() backgroundColor = new EventEmitter();

  minMaxL = new FormControl(DIALOG_POPUP.NULL, Validators.compose([Validators.required, Validators.min(1),
    Validators.max(5000), Validators.pattern(DIALOG_POPUP.PATTERN_NUMBER)]));
  minMaxH = new FormControl(DIALOG_POPUP.NULL, Validators.compose([Validators.required, Validators.min(1),
    Validators.max(5000), Validators.pattern(DIALOG_POPUP.PATTERN_NUMBER)]));

  redColor = new FormControl(DIALOG_POPUP.THF, Validators.compose([Validators.min(0), Validators.max(255)]));
  greenColor = new FormControl(DIALOG_POPUP.THF, Validators.compose([Validators.min(0), Validators.max(255)]));
  blueColor = new FormControl(DIALOG_POPUP.THF, Validators.compose([Validators.min(0), Validators.max(255)]));
  alphaAttr = new FormControl(DIALOG_POPUP.THF, Validators.compose([Validators.min(0), Validators.max(1)]));

  setBackground(fill: string): void {
    this.colorToolService.inDialog = true;
    this.dialogPopup.backgroundHex = fill;
  }

  ngOnInit() {
    this.colorProperties.typeColor = 'back';
    this.colorToolService.setType('back');
    this.drawingCanvas.currentHeight.subscribe( (height) => {
      if (this.minMaxH.untouched && this.minMaxL.untouched) {this.data.height = height; }});
    this.drawingCanvas.currentWidth.subscribe( (width) => {
      if (this.minMaxL.untouched && this.minMaxH.untouched) {this.data.length = width; }});
  }

  closeWindow(): void {
    this.dialogRef.close();
    this.hotkey.popupBoolChange(false);
  }

  saveValues(x: string, y: string): void {
    this.colorToolService.inDialog = false;
    if (this.mouseServ.drawingContainsElement) {
      if (confirm(DIALOG_POPUP.CONFIRM)) {
        this.dialogPopup.length = +x;
        this.dialogPopup.height = +y;
        this.drawingCanvas.createSVG(this.dialogPopup.length, this.dialogPopup.height, this.dialogPopup.backgroundHex);
        this.colorToolService._Background = this.dialogPopup.backgroundHex;

        this.closeWindow();
      }
    } else {
      this.dialogPopup.length = +x;
      this.dialogPopup.height = +y;
      this.drawingCanvas.createSVG(this.dialogPopup.length, this.dialogPopup.height, this.dialogPopup.backgroundHex);
      this.colorToolService._Background = this.dialogPopup.backgroundHex;

      this.closeWindow();
    }
    this.colorToolService.setType('primary');
    this.colorPicker.setColorType('primary');
    this.colorProperties.typeColor = 'primary';
  }

  getErrorMessage(): string {
    return this.minMaxL.hasError(DIALOG_POPUP.REQUIRED) ? this.dialogPopup.prompter :
    this.minMaxH.hasError(DIALOG_POPUP.REQUIRED) ? this.dialogPopup.prompter :
    this.minMaxL.hasError(DIALOG_POPUP.MIN) ? this.dialogPopup.lengthMin :
    this.minMaxH.hasError(DIALOG_POPUP.MIN) ? this.dialogPopup.heightMin :
    this.minMaxL.hasError(DIALOG_POPUP.MAX) ? this.dialogPopup.lengthMax :
    this.minMaxH.hasError(DIALOG_POPUP.MAX) ?  this.dialogPopup.heightMax :
    this.minMaxL.hasError(DIALOG_POPUP.PATTERN) ? this.dialogPopup.numberOnly :
    this.minMaxH.hasError(DIALOG_POPUP.PATTERN) ? this.dialogPopup.numberOnly :
            '';
  }

  getErrorMessageRgba(): string {
    return this.redColor.hasError(DIALOG_POPUP.REQUIRED) ? DIALOG_POPUP.MESSAGE :
      this.greenColor.hasError(DIALOG_POPUP.REQUIRED) ? this.dialogPopup.prompter :
        this.blueColor.hasError(DIALOG_POPUP.REQUIRED) ? this.dialogPopup.prompter :
          this.alphaAttr.hasError(DIALOG_POPUP.REQUIRED) ? this.dialogPopup.prompter :
            this.redColor.hasError(DIALOG_POPUP.MIN) ? this.dialogPopup.betweenD :
              this.greenColor.hasError(DIALOG_POPUP.MIN) ? this.dialogPopup.betweenD :
                this.blueColor.hasError(DIALOG_POPUP.MIN) ? this.dialogPopup.betweenD :
                  this.alphaAttr.hasError(DIALOG_POPUP.MIN) ? this.dialogPopup.betweenU :
            '';
  }

  backgroundColorRgba(red: string, green: string, blue: string, alpha: number): void {
    const a = Math.floor(alpha * 255) < 16 ? DIALOG_POPUP.ZERO +
      Math.floor(alpha * 255).toString(16) : Math.floor(alpha * 255).toString(16);
    this.dialogPopup.backgroundHex = DIALOG_POPUP.POUND +
      (DIALOG_POPUP.ZERO + parseInt(red, 10).toString(16)).slice(-2) +
      (DIALOG_POPUP.ZERO + parseInt(green, 10).toString(16)).slice(-2) +
      (DIALOG_POPUP.ZERO + parseInt(blue, 10).toString(16)).slice(-2) + a;
  }
}
