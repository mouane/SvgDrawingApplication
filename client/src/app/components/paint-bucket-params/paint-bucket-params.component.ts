import { Component, OnInit } from '@angular/core';
import { PaintBucketService } from 'src/app/services/paint-bucket/paint-bucket.service';
const TOLERANCE = 0;
@Component({
  selector: 'app-paint-bucket-params',
  templateUrl: './paint-bucket-params.component.html',
  styleUrls: ['./paint-bucket-params.component.scss'],
})
export class PaintBucketParamsComponent implements OnInit {

  constructor(private paintBucketService: PaintBucketService) { }

  sliderValueTolerance = TOLERANCE;

  // tslint:disable-next-line: no-empty
  ngOnInit() {}

  onSliderchangeTolerance(event: any): void {
    this.sliderValueTolerance = event.value;
    this.paintBucketService._Tolerance = this.sliderValueTolerance;
  }
}
