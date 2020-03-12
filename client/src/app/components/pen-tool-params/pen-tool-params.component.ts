import { Component } from '@angular/core';
import { DEFAULT_VALUES } from 'src/app/enum';
import { PenToolService} from '../../services/pen-tool/pen-tool.service';

@Component({
  selector: 'app-pen-tool-params',
  templateUrl: './pen-tool-params.component.html',
  styleUrls: ['./pen-tool-params.component.scss'],
})
export class PenToolParamsComponent {
  sliderMax: number = DEFAULT_VALUES.TIP_MAX;
  sliderMin: number = DEFAULT_VALUES.TIP_MIN;
  constructor(private penToolService: PenToolService) {}

  sliderTipMax(event: any): void {
    this.sliderMax = event.value;
    this.penToolService._TipMax = this.sliderMax;
  }

  sliderTipMin(event: any): void {
    this.sliderMin = event.value;
    this.penToolService._TipMin = this.sliderMin;
    if (this.sliderMin >= this.sliderMax) {
      this.sliderMin = this.sliderMax - DEFAULT_VALUES.MIN_MAX_DIFF;
    }
  }

}
