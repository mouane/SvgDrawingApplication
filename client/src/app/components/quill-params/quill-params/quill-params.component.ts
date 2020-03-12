import { Component, OnInit } from '@angular/core';
import { QuillToolService } from 'src/app/services/quill-tool/quill-tool.service';

const SLIDERVALUE = 20;

@Component({
  selector: 'app-quill-params',
  templateUrl: './quill-params.component.html',
  styleUrls: ['./quill-params.component.scss'],
})
export class QuillParamsComponent implements OnInit {

  constructor(private quill: QuillToolService) {}

  sliderValue = SLIDERVALUE;
  angleValue = this.quill.angle;

  ngOnInit() {
    this.quill.rotation.subscribe( (item: number) => {
      this.angleValue = Math.abs(item % 360);
    });
  }
  onSliderChange(event: any): void {
    this.sliderValue = event.value;
    this.quill.tip = this.sliderValue;
  }

  onAngleChange(event: any): void {
    this.angleValue = event.value;
    this.quill.angle = this.angleValue;
  }
}
