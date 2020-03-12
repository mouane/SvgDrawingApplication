import { Component } from '@angular/core';
import { PencilToolService } from 'src/app/services/pencilTool/pencilTool';
const SLIDERVALUE = 2;
@Component({
  selector: 'app-pencil-params',
  templateUrl: './pencil-params.component.html',
  styleUrls: ['./pencil-params.component.scss'],
})
export class PencilParamsComponent {

  constructor(private pencil: PencilToolService) { }

  sliderValue = SLIDERVALUE;

  onSliderchange(event: any): void {
    this.sliderValue = event.value;
    this.pencil._Tip = this.sliderValue;
  }

}
