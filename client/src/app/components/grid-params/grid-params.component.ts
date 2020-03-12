import { Component } from '@angular/core';
import { DEFAULT_VALUES } from 'src/app/enum';
import { GridConfigService } from 'src/app/services/grid-config/grid-config.service';

@Component({
  selector: 'app-grid-params',
  templateUrl: './grid-params.component.html',
  styleUrls: ['./grid-params.component.scss'],
})
export class GridParamsComponent {

  gridOpacity: number = DEFAULT_VALUES.GRID_OPACITY_PERCENT;
  gridValue: number = DEFAULT_VALUES.GRID_VALUE;
  gridActivated = false;
  constructor(private gridService: GridConfigService) { }

  updateGrid(): void {
    this.gridService.updateGrid(this.gridActivated, this.gridValue, (this.gridOpacity / 100.0));
  }
  formatGridSlider(value: number): string {
    return value + '%';
  }

}
