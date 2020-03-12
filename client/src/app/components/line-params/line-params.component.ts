import { Component } from '@angular/core';
import { DEFAULT_COLORS} from 'src/app/enum';
import { LineToolService } from '../../services/line-tool/line-tool.service';
const SLIDERVALUE = 2;
@Component({
  selector: 'app-line-params',
  templateUrl: './line-params.component.html',
  styleUrls: ['./line-params.component.scss'],
})
export class LineParamsComponent {
  sliderValue = SLIDERVALUE;
  lineSliderValue: number;
  primary = DEFAULT_COLORS.BLUE;

  constructor(private lineTool: LineToolService) { }

  onSliderChange(event: any): void {
    this.sliderValue = event.value;
    this.lineTool._Tip = this.sliderValue;
  }

  lineSliderChange(event: any): void {
    this.lineSliderValue = event.value;
    this.lineTool._DotSize = this.lineSliderValue;
  }
  setDottedLine(): void {
    this.lineTool.setDottedLine();
  }

  setDashedLine(): void {
    this.lineTool.setDashLine();
  }

  setContinuedLine(): void {
    this.lineTool.setContinuedLine();
  }

  setRoundJunction(): void {
    this.lineTool.setJunctionRound();
  }

  setAngledJunction(): void {
    this.lineTool.setJunctionAngle();
  }

  setDottedJunction(): void {
    this.lineTool.setJunctionDot();
  }

}
