import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { SelectionParamsComponent } from '../selection-params/selection-params.component';
import { WelcomeWindowComponent } from './welcome-window.component';

describe('WelcomeWindowComponent', () => {
  let component: WelcomeWindowComponent;
  let fixture: ComponentFixture<WelcomeWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeWindowComponent ],
      providers: [CookieService, SelectionParamsComponent, EraserProperties],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#checkBoxClick should inverse the checkBoxBool boolean', () => {
    component.checkBoxClicked = true;
    component.checkBoxClick();
    expect(component.checkBoxClicked).toBe(false);
  });

  it('#checkBoxClick should not call cookie.delete if checkBoxBool is false', () => {
    component.checkBoxClicked = false;
    // tslint:disable-next-line: no-string-literal
    spyOn(component['cookie'], 'delete');
    component.welcomeWindowCloseFunction();
    // tslint:disable-next-line: no-string-literal
    expect(component['cookie'].delete).toHaveBeenCalled();
  });

  it('#checkBoxClick should emit welcomeWindowBool to false', (done) => {
    component.welcomeEvent.subscribe((g: boolean) => {
      expect(g).toBe(false);
      done();
   });
    component.welcomeWindowCloseFunction();
  });
  it('#welcomeWindowCloseFunction should set the cookies', () => {
    component['checkBoxClicked'] = true;
    spyOn(component['cookie'], 'set');
    component.welcomeWindowCloseFunction();
    expect(component['cookie'].set).toHaveBeenCalledWith('userid', '12345');
  });
  it('#ngOnInit should set shouldNotOpen to false', () => {
    component['cookie'].set('userid', '12345');
    component.ngOnInit();
    expect(component.shouldNotOpen).toBeFalsy();
  });
});
