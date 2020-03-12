import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BrushToolService } from '../../services/brush-tool/brushTool.service';

@Component({
  selector: 'app-filter-texture',
  templateUrl: './filter-texture.component.html',
  styleUrls: ['./filter-texture.component.scss'],
})
export class FilterTextureComponent implements AfterViewInit {

  constructor(private brushTool: BrushToolService) { }

  @ViewChild('base', {static: false}) base: ElementRef;
  @ViewChild('turbulence', {static: false}) turbulence: ElementRef;
  @ViewChild('noise', {static: false}) noise: ElementRef;
  @ViewChild('blurry', {static: false}) blurry: ElementRef;
  @ViewChild('squigly', {static: false}) squigly: ElementRef;

  ngAfterViewInit(): void {
    this.brushTool._FilterBase = this.base.nativeElement;
    this.brushTool._FilterBlurry = this.blurry.nativeElement;
    this.brushTool._FilterNoise = this.noise.nativeElement;
    this.brushTool._FilterSquigly = this.squigly.nativeElement;
    this.brushTool._FilterTurbulence = this.turbulence.nativeElement;
  }
}
