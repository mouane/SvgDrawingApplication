import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { OpenDrawingProperties } from 'src/app/classes/openDrawingProperties/open-drawing-properties';
import { ToolBoxPropreties } from 'src/app/classes/toolBoxPropreties/toolsBoxPropreties';
import { DIALOG_OPEN_LOCAL, OPEN_LOCAL } from 'src/app/enum';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { OpenDrawingService } from 'src/app/services/open-drawing/open-drawing.service';
import { Drawing } from '../../../../../common/communication/drawing';

@Component({
  selector: 'app-dialog-popup-open-locally',
  templateUrl: './dialog-popup-open-locally.component.html',
  styleUrls: ['./dialog-popup-open-locally.component.scss'],
})
export class DialogPopupOpenLocallyComponent implements OnInit {

  constructor(private openDrawingService: OpenDrawingService, private properties: OpenDrawingProperties,
              public dialogRef: MatDialogRef<DialogPopupOpenLocallyComponent>, private hotkey: HotkeysService,
              private toolBoxProperties: ToolBoxPropreties) { }

  ngOnInit() {
    this.hotkey.popupActive = true;
  }

  readUrl($event: any): void {
    if ($event.target.files && $event.target.files[0]) {
      this.properties.fileChosen = true;
      const myFile = $event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(myFile);
      reader.onload = this.loadCallback(reader, myFile.name);
    }
  }
  loadCallback(reader: FileReader, fileName: string): () => void {
    return () => {
      let content = reader.result;
      if (content !== null) {
        content = content.toString();
        this.formatContent(content, fileName);
      }
    };
  }

  formatContent(fileContent: string, fileName: string): void {
    let mainSvg = new Array<string>();
    let svgChildren = new Array<string>();
    const svgInfo = fileContent.split(DIALOG_OPEN_LOCAL.CLOSE_COMMA).join(DIALOG_OPEN_LOCAL.CLOSE_AND).split(DIALOG_OPEN_LOCAL.AND)[0];
    mainSvg = svgInfo.split(new RegExp(DIALOG_OPEN_LOCAL.REGEXP), 3);
    const firstChildIndex = fileContent.indexOf(DIALOG_OPEN_LOCAL.LESSER);
    const children = fileContent.substring(firstChildIndex);
    svgChildren = children.split(DIALOG_OPEN_LOCAL.GREAT_COMMA).join(DIALOG_OPEN_LOCAL.GREAT_AND).split(DIALOG_OPEN_LOCAL.AND);
    this.createDrawingObject(mainSvg, svgChildren, fileName);
  }

  createDrawingObject(mainSVG: string[], svgChildren: string[], fileName: string): void {
    const localDrawing: Drawing = {
      tags: [],
      name: fileName,
      childList: svgChildren,
      drawingImg: DIALOG_OPEN_LOCAL.NULL,
      drawingColor: mainSVG[OPEN_LOCAL.BGCOLOR_INDEX],
      drawingHeight: mainSVG[OPEN_LOCAL.HEIGTH_INDEX],
      drawingWidth: mainSVG[OPEN_LOCAL.WIDTH_INDEX],
      createdAt: '',
    };
    this.openDrawingService.loadDrawingCaller(localDrawing);
  }

  loadDrawing(): void {
    this.openDrawingService.loadDrawing();
    if (!this.openDrawingService.getErrorFound()) {
      this.toolBoxProperties.drawingExist = true;
      this.dialogClose();
    }
  }

  dialogClose(): void {
    this.dialogRef.close();
    this.hotkey.popupActive = false;
    this.properties.fileChosen = false;
  }
}
