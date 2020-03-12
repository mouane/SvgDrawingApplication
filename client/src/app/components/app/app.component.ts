import { Component, HostListener, OnInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SvgSelectorProperties } from 'src/app/classes/svgSelectorProperties/svg-properties';
import { COOKIE, tools } from 'src/app/enum';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { MouseControlService } from 'src/app/services/mouse-control/mouse-control.service';

export interface DialogData {
  length: number;
  heigth: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor( private hotkeyService: HotkeysService,
               private cookieService: CookieService,
               private mouseService: MouseControlService,
               private properties: SvgSelectorProperties,
               ) {}
  checkCookie = false;
  showCanvas: boolean;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.hotkeyService.keyEvent(event);
  }
  mouseWheel($event: WheelEvent) {
    if ($event.altKey || $event.shiftKey || this.mouseService.getChoice() === tools.SELECT ||
        this.mouseService.getChoice() === tools.QUILL ) {
      this.mouseService.mouseWheel($event);
      if (this.mouseService.getChoice() === tools.SELECT) {
        if (this.properties.selctedChilds.length >= 1) {
        $event.preventDefault();
        }
      }
      if (this.mouseService.getChoice() === tools.QUILL) {
          $event.preventDefault();
      }
    }
  }

  changeCanvasState($event: boolean ) {
    this.showCanvas = $event;
  }

  ngOnInit() {
    if (this.cookieService.get(COOKIE.CLIENT_ID) === COOKIE.COOKIE_ID) {
      this.checkCookie = true;
      this.hotkeyService.popupBoolChange(false);
    }
  }
  clearCookie(): void {
    if ( this.cookieService.get(COOKIE.CLIENT_ID) === COOKIE.COOKIE_ID) {
        this.cookieService.delete(COOKIE.CLIENT_ID);
    }
  }
}
