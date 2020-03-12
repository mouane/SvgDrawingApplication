import { Component } from '@angular/core';
import { BrushToolService } from 'src/app/services/brush-tool/brushTool.service';
const SLIDERVALUE = 2;
@Component({
  selector: 'app-brush-params',
  templateUrl: './brush-params.component.html',
  styleUrls: ['./brush-params.component.scss'],
})
export class BrushParamsComponent {

  sliderValue = SLIDERVALUE;
  constructor(private brushTool: BrushToolService) { }

  onSliderchange(event: any) {
    this.sliderValue = event.value;
    this.brushTool._Tip = this.sliderValue;
  }
  setTextureBase(): void {
    this.brushTool._CurrentFilter = this.brushTool.FilterBase;
  }

  setTextureTurbulence(): void {
    this.brushTool._CurrentFilter = this.brushTool.FilterTurbulence;
  }

  setTextureNoise(): void {
    this.brushTool._CurrentFilter = this.brushTool.FilterNoise;
  }

  setTextureBlurry(): void {
    this.brushTool._CurrentFilter = this.brushTool.FilterBlurry;
  }

  setTextureSquigly(): void {
    this.brushTool._CurrentFilter = this.brushTool.FilterSquigly;
  }

}
