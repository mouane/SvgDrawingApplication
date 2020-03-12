import { Component, OnInit } from '@angular/core';
import { AirBrushToolService } from 'src/app/services/airBrush-tool/air-brush-tool.service';
const SLIDERVALUESIZE = 20;
const SLIDERVALUESPARKS = 50;
@Component({
  selector: 'app-air-brush-params',
  templateUrl: './airBrush-params.component.html',
  styleUrls: ['./airBrush-params.component.scss'],
})
export class AirBrushParamsComponent implements OnInit {

  constructor(private airBrushService: AirBrushToolService) { }

  sliderValueSize = SLIDERVALUESIZE;
  sliderValueSparks = SLIDERVALUESPARKS;

  // tslint:disable-next-line: no-empty
  ngOnInit() { }
  onSliderchangeSize(event: any): void {
    this.sliderValueSize = event.value;
    this.airBrushService.tip = this.sliderValueSize;
  }

  onSliderchangeSparks(event: any): void {
    this.sliderValueSparks = event.value;
    this.airBrushService.sparksPerSec = this.sliderValueSparks;
  }
}
