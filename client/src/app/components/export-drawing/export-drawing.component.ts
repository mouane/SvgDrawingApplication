import { Component, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { GridConfigService } from 'src/app/services/grid-config/grid-config.service';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { SaveDrawingService } from 'src/app/services/save-drawing/save-drawing.service';
import { GridParamsComponent } from '../grid-params/grid-params.component';
import { ExportDrawingFormatService } from './../../services/export-drawing-format/export-drawing-format.service';
import { ImageType } from './drawingImageFormat';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
  constructor(
    public dialogRef: MatDialogRef<ExportDrawingComponent>,
    private exportDrawing: ExportDrawingFormatService,
    private saveDrawing: SaveDrawingService,
    private render: Renderer2,
    private hotkeysService: HotkeysService,
    private gridConfigService: GridConfigService,
    private gridparam: GridParamsComponent,
    ) { }
svg: SVGElement = this.saveDrawing.getSVGElement();
private selected: string;
imageTypes: ImageType[] = [
  {value: 'bmp', viewValue: 'bmp'},
  {value: 'jpeg', viewValue: 'jpeg'},
  {value: 'png',  viewValue: 'png'},
  {value: 'svg', viewValue: 'svg'},
];

  dialogClose(): void {
    this.dialogRef.close();
    this.hotkeysService.popupActive = false;
  }

  export(data: string): void {
  this.exportDrawing.setCurrentRendererAndSVG(this.render, this.svg);
  const gridActive: boolean = this.gridConfigService.gridActivated;
  const gridValue: number = this.gridConfigService.gridValue;
  const gridOpacity: number = this.gridConfigService.gridOpacity;
  if (this.selected === undefined) {
      alert('Veuillez sélectionner un format');
  } else {
    if (confirm('Etes-vous sur de vouloir exporter le dessin courant')) {
      if (gridActive) {
        this.gridConfigService.updateGrid(false, gridValue,
          gridOpacity);
    }
      this.exportDrawing.loadImage(this.selected);
      this.dialogRef.close();
  }
    if (gridActive) {
    this.gridparam.gridActivated = true;
    this.gridparam.gridOpacity = gridOpacity * 100;
    this.gridparam.gridValue = gridValue;
    this.gridparam.updateGrid();
  }
  }
}
}
