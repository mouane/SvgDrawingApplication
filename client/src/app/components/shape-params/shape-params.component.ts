import { Component } from '@angular/core';
import { ShapeProperties } from 'src/app/classes/shapeProperties/shape-properties';
import { POLYGON } from 'src/app/enum';
import { ShapeToolService } from 'src/app/services/shape-tool/shape-tool.service';

@Component({
  selector: 'app-shape-params',
  templateUrl: './shape-params.component.html',
  styleUrls: ['./shape-params.component.scss'],
})
export class ShapeParamsComponent {

  constructor(private form: ShapeToolService, private shapeProperties: ShapeProperties ) {
   }
  change(event: any): void {
    if (event.isUserInput) {
      this.shapeProperties.shapeChosen = (event.source.value);
    }
    this.form.updateShapeChosen(this.shapeProperties.shapeChosen);
  }

  traceType(type: string): void {
    this.form.traceType(type, true);
  }

  onSliderchange(event: any): void {
    this.shapeProperties.sliderValue = event.value;
    this.form.thickness(this.shapeProperties.sliderValue);
    this.thickness(this.shapeProperties.sliderValue);
  }
  thickness(thickness: number): void {
    this.form.thickness(thickness);
  }

  polygonSide(nbrSides: string): void {
    if (nbrSides === 'plus' && this.shapeProperties.nbrOfSidesPolygon < POLYGON.MAX_SIDES) {
      this.shapeProperties.nbrOfSidesPolygon += 1;
    } else if (nbrSides === 'less' && this.shapeProperties.nbrOfSidesPolygon > POLYGON.MIN_SIDES) {
      this.shapeProperties.nbrOfSidesPolygon -= 1;
    }
    this.form.setPolygonSide(this.shapeProperties.nbrOfSidesPolygon);
  }

}
