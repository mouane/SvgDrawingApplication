import { Component } from '@angular/core';
import { DEFAULT_VALUES } from 'src/app/enum';
import { TextService } from 'src/app/services/text/text.service';
export interface Police {
  value: string;
}
const SLIDERVALUE = 25;
@Component({
  selector: 'app-text-params',
  templateUrl: './text-params.component.html',
  styleUrls: ['./text-params.component.scss'],
})
export class TextParamsComponent {

  policeList: Police[] = [
    { value: 'sans-serif' },
    { value: 'arial'},
    { value: 'roboto' },
    { value: 'times new roman' },
  ];
  size: number;
  cursorSVGElement: any;
  policeChosen: string = DEFAULT_VALUES.TEXT_POLICE;
  constructor(private textService: TextService) { }

  sliderValue = SLIDERVALUE;

  change(event: any): void {
    if (event.isUserInput) {
      this.policeChosen = (event.source.value);
    }
    this.textService.setPolice(this.policeChosen);
  }
  onSliderchange(event: any): void {
    this.sliderValue = event.value;
    this.textService.setSize(this.sliderValue);
  }
  textGras(): void {
    this.textService.setBold();
  }
  textItalique(): void {
    this.textService.setItalic();
  }
  textAlignLeft(): void {
    this.textService.setAlignementLeft();
  }
  textAlignRight(): void {
    this.textService.setAlignementRight();
  }
  textAlignMiddle(): void {
    this.textService.setAlignementMiddle();
  }
}
