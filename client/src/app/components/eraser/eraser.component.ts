import { Component } from '@angular/core';
import { EraserService } from 'src/app/services/eraser/eraser.service';
const SLIDERVALUE = 25;
@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent {
  size: number;

  constructor(private eraser: EraserService) { }

  sliderValue = SLIDERVALUE;

  onSliderChange(event: any): void {
    this.sliderValue = event.value;
    this.eraser.setEraserSize(this.sliderValue);
  }
}
