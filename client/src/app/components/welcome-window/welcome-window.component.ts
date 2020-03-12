import { Component, EventEmitter , OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { COOKIE } from 'src/app/enum';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';

@Component({
  selector: 'app-welcome-window',
  templateUrl: './welcome-window.component.html',
  styleUrls: ['./welcome-window.component.scss'],
})
export class WelcomeWindowComponent implements OnInit {

  constructor(private cookie: CookieService, private hotkey: HotkeysService) {}

  shouldNotOpen: boolean;

  @Output() welcomeEvent = new EventEmitter<boolean>();
  checkBoxClicked = false;

  ngOnInit() {
    if (this.cookie.get(COOKIE.CLIENT_ID) === COOKIE.COOKIE_ID) {
      this.shouldNotOpen = false;
    } else {
      this.shouldNotOpen = true;
      this.hotkey.welcomeWindowActive = true;
    }
    this.welcomeEvent.emit(this.shouldNotOpen);
  }

  welcomeWindowCloseFunction(): void {
    this.shouldNotOpen = false;
    if (this.checkBoxClicked) {
      this.cookie.set(COOKIE.CLIENT_ID, COOKIE.COOKIE_ID);
    }
    if (!this.checkBoxClicked) {
      this.cookie.delete(COOKIE.CLIENT_ID);
    }
    this.welcomeEvent.emit(this.shouldNotOpen);
    this.hotkey.welcomeWindowActive = false;
  }
  checkBoxClick(): void {
    this.checkBoxClicked = !(this.checkBoxClicked);
  }
}
