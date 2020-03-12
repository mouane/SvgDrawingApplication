import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { OpenDrawingProperties } from 'src/app/classes/openDrawingProperties/open-drawing-properties';
import { DIALOG_OPEN } from 'src/app/enum';
import { SafePipe } from 'src/app/pipe/safe.pipe';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { OpenDrawingService } from 'src/app/services/open-drawing/open-drawing.service';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { Drawing } from '../../../../../common/communication/drawing';
import { DeleteDrawingService } from './../../services/delete-drawing/delete-drawing.service';

@Component({
  selector: 'app-dialog-popup-open-drawing',
  templateUrl: './dialog-popup-open-drawing.component.html',
  styleUrls: ['./dialog-popup-open-drawing.component.scss'],
})
export class DialogPopupOpenDrawingComponent implements OnInit {

  constructor(private openDrawing: OpenDrawingService,
              private hotkey: HotkeysService,
              private safepipehtmlurl: SafePipe,
              private properties: OpenDrawingProperties,
              public dialogRef: MatDialogRef<DialogPopupOpenDrawingComponent>,
              private renderer: Renderer2,
              private deleteService: DeleteDrawingService,
              private saveDrawing: SaveDrawingService,
               ) { }
  @ViewChild(DIALOG_OPEN.NODRAWINGS, { static: false }) noDrawings: ElementRef;
  ngOnInit(): void {
    this.properties.theSelectedDrawing = {} as Drawing;
    this.hotkey.popupActive = true;
    this.openDrawing.getDrawingData().subscribe(((drawings: Drawing[]) => {
    this.properties.drawingsList = drawings;
    this.properties.loading = false;
      // tslint:disable-next-line: forin
    for (const index in this.properties.drawingsList) {
      // tslint:disable-next-line: forin

      this.properties.drawing.push(this.safepipehtmlurl.transform(this.properties.drawingsList[index].drawingImg));
      // tslint:disable-next-line: forin
      for (const i in this.properties.drawingsList[index].tags) {
        this.properties.tagsList.push(this.properties.drawingsList[index].tags[i]);
      }
    }
    const uniqueset = new Set(this.properties.tagsList);
    this.properties.tagsList = [...uniqueset];
    this.properties.selectedTags = this.properties.tagsList;

    }), (error: any) => {
      this.properties.loading = false;
      window.alert(DIALOG_OPEN.ALERT_OUVERT);
    });
  }

  onNgModelChange(event: any): void {
    // tslint:disable-next-line: forin
    for (const index in this.properties.drawingsList) {
      this.properties.exists = false;
      // tslint:disable-next-line: prefer-for-of
      for (let k = 0; k < this.properties.showDrawings.length; k++) {
        if (this.properties.showDrawings[k] === this.properties.drawingsList[index]) {
          this.properties.exists = true;
        }
      }
      if (!this.properties.exists) {
        this.properties.showDrawings.push(this.properties.drawingsList[index]);
        this.properties.drawingFiltered.push(this.properties.drawing[index]);
      }
    }
    // tslint:disable-next-line: forin
    for (const index in this.properties.showDrawings) {
      this.properties.exists = false;
      // tslint:disable-next-line: prefer-for-of
      for (let k = 0; k < this.properties.drawingsList.length; k++) {
        if (this.properties.drawingsList[k] === this.properties.showDrawings[index]) {
          this.properties.exists = true;
        }
      }
      if (!this.properties.exists) {
        this.properties.drawingsList.push(this.properties.showDrawings[index]);
        this.properties.drawing.push(this.properties.drawingFiltered[index]);
      }
    }
    // tslint:disable-next-line: forin
    for ( let index = 0; index < this.properties.drawingsList.length; index++) {
      this.properties.includes = false;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0 ; i < this.properties.drawingsList[index].tags.length; i++) {
        // tslint:disable-next-line: forin
        for (const e in event) {
          if (this.properties.drawingsList[index].tags[i] === event[e]) {
            this.properties.includes = true;
          }
        }
      }
      if (!this.properties.includes) {
        this.properties.drawingsList.splice(Number(index),  1);
        this.properties.drawing.splice(Number(index),  1);
        index--;

      }
    }
    if (this.properties.drawingsList.length === 0) {
      this.properties.paragraph = this.renderer.createElement(DIALOG_OPEN.P);
      const text = this.renderer.createText(DIALOG_OPEN.CREATE_TEXT);
      this.renderer.appendChild(this.properties.paragraph, text);
      this.renderer.appendChild(this.noDrawings.nativeElement, this.properties.paragraph);
    } else if (this.noDrawings.nativeElement.contains(this.properties.paragraph)) {
      this.renderer.removeChild(this.noDrawings, this.properties.paragraph);
    }
  }

  getTheSelectedDrawing(): Drawing {
    return this.properties.theSelectedDrawing;
  }

  loadDrawingCaller(selectedDrawing: Drawing): void {
    this.openDrawing.loadDrawingCaller(selectedDrawing);
  }

  deleteDrawing(): void {
    for (const i in this.properties.drawingsList) {
      if (this.properties.drawingsList[i] === this.properties.theSelectedDrawing) {
          this.saveDrawing.deleteDrawingFromFirebase(this.properties.theSelectedDrawing.name);
          // type non existant in scope of angular (mongo object _id) //
          const tempName = this.properties.theSelectedDrawing.name;
          const drawingId = (this.properties.theSelectedDrawing as any )['_id'];
          this.deleteService.deleteDrawing(drawingId).subscribe((res) => {
            console.log(res);
          });
          this.properties.drawingsList.length = 0;
          this.ngOnInit();
          alert('Le dessin ' + tempName + ' a été supprimer!');
          this.dialogRef.close();
          }
      }
    }
  loadDrawing(): void {
    try {
    this.openDrawing.loadDrawing();
    this.dialogRef.close();
    } catch {
      window.alert(DIALOG_OPEN.ALERT_CHOIX);
    }
  }
  dialogClose(): void {
    this.dialogRef.close();
    this.hotkey.popupActive = false;
  }
}
