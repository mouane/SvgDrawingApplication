import { Component, ElementRef, OnInit } from '@angular/core';
import { DEFAULT_VALUES } from 'src/app/enum';
import { StampselectorService } from 'src/app/services/stamp-selector/stampselector.service';

@Component({
  selector: 'app-stamp-params',
  templateUrl: './stamp-params.component.html',
  styleUrls: ['./stamp-params.component.scss'],
})
export class StampParamsComponent implements OnInit {

  constructor(private stampSelect: StampselectorService, private child: ElementRef) {
  }

  nominator: number = DEFAULT_VALUES.STAMP_NUM;
  denominator: number = DEFAULT_VALUES.STAMP_DENUM;
  rotationFactor: number = DEFAULT_VALUES.STAMP_ROTATION_FACTOR;

  ngOnInit() {
    this.stampSelect.rotationFact.subscribe( (item: number) => this.rotationFactor = item);
    this.stampSelect.nominator.subscribe( (item: number) => this.nominator = item);
    this.stampSelect.denominator.subscribe( (item: number) => this.denominator = item);
  }

  imageClicked(current: string): void {
    this.stampSelect._Current = current;
    this.stampSelect._ImageChosen = true;
    (this.child.nativeElement as HTMLElement).childNodes[0].childNodes[1].childNodes.forEach((child) => {
      if ((child as HTMLElement).classList.contains('stamp')) {
        const img = ((child as HTMLElement).childNodes[0] as HTMLImageElement);
        if (img.classList.contains('stampSelected')) {
          img.classList.remove('stampSelected');
        }
        if (img.src.includes(current)) {
          img.classList.add('stampSelected');
        }
      }
    });
  }
  incrementScalingFactor(): void {
    this.stampSelect.incrementScalingFactor();
  }
  decrementScalingFactor(): void {
    this.stampSelect.decrementScalingFactor();
  }
  incrementRotationFactor(): void {
    this.stampSelect.incrementRotationFactor();
  }
  decrementRotationFactor(): void {
    this.stampSelect.decrementRotationFactor();
  }
}
