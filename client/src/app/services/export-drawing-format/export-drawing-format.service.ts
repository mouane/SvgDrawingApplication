import { Injectable, Renderer2 } from '@angular/core';
import { GridParamsComponent } from 'src/app/components/grid-params/grid-params.component';
import { GridConfigService } from '../grid-config/grid-config.service';
import { ExportDrawingProperties } from './../../classes/exportDrawingProperties/exportDrawingProperties';

@Injectable({
  providedIn: 'root',
})
export class ExportDrawingFormatService {

  constructor(private gridConfigService: GridConfigService,
              private gridparam: GridParamsComponent,
              private properties: ExportDrawingProperties) { }
  svgBase64(): string {
    const begining = 'data:image/svg+xml;base64,';
    return begining + btoa(new XMLSerializer().serializeToString(this.properties.svg as Node));
  }
  encodeDrawingImage(): void {
    this.properties.drawingImage = new Image();
    this.properties.drawingImage.height = this.properties.svg.getBoundingClientRect().height;
    this.properties.drawingImage.width = this.properties.svg.getBoundingClientRect().width;
    this.properties.drawingImage.src = this.svgBase64();
  }
  downloadDrawingImage(): void {
    const anchorElement = this.properties.renderer.createElement('a');
    this.properties.renderer.appendChild(this.properties.svg, anchorElement);
    anchorElement.href = this.properties.canvas.toDataURL('image/' + this.properties.drawingFormat);
    const tmp: boolean = this.gridConfigService.gridActivated;
    if (this.properties.drawingFormat === 'svg') {
      this.gridConfigService.updateGrid(false, this.gridConfigService.gridValue,
        this.gridConfigService.gridOpacity);
      anchorElement.href = this.svgBase64();
      anchorElement.download = 'document.' + this.properties.drawingFormat;
      anchorElement.click();
      this.properties.renderer.removeChild(this.properties.svg, anchorElement);
      if (tmp) {
        this.gridparam.updateGrid(); }
    } else {
      anchorElement.download = 'image.' + this.properties.drawingFormat;
      anchorElement.click();
      this.properties.renderer.removeChild(this.properties.svg, anchorElement);
    }

  }
  drawingImageOnCanvas(): void {
    this.properties.canvas = this.properties.renderer.createElement('canvas');
    this.properties.canvas.height = this.properties.svg.getBoundingClientRect().height;
    this.properties.canvas.width = this.properties.svg.getBoundingClientRect().width;
    this.properties.context = this.properties.canvas.getContext('2d');
    if (this.properties.context) {
      this.encodeDrawingImage();
      this.properties.drawingImage.decode().then(() => {
        if (this.properties.context) {
          this.properties.context.drawImage(this.properties.drawingImage, 0, 0);
          this.downloadDrawingImage();
        }
      });
    }
  }
  loadImage(format: string) {
    this.properties.drawingFormat = format;
    this.drawingImageOnCanvas();
  }
  setCurrentRendererAndSVG(renderer: Renderer2, svg: SVGElement) {
    this.properties.renderer = renderer;
    this.properties.svg = svg;
  }
}
