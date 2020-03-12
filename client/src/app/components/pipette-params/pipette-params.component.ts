import { Component } from '@angular/core';
import { PipetteService } from 'src/app/services/pipette/pipette.service';
import { ColorToolService } from '../../services/color-tool/color-tool.service';

@Component({
  selector: 'app-pipette-params',
  templateUrl: './pipette-params.component.html',
  styleUrls: ['./pipette-params.component.scss'],
})

export class PipetteParamsComponent {
  fill: string;
  outline: string;
  constructor(private colorToolService: ColorToolService, private pipetteService: PipetteService) {
    this.fill = pipetteService.getPrimaryColor();
    this.outline = pipetteService.getSecondaryColor();
  }

  setPipetteColor(): void {
    this.colorToolService._Fill = this.fill;
    this.colorToolService._Outline = this.outline;
  }
  getFill(): string {
    this.fill = this.pipetteService.getPrimaryColor();
    return this.fill;
  }

  getOutline(): string {
    this.outline = this.pipetteService.getSecondaryColor();
    return this.outline;
  }

}
