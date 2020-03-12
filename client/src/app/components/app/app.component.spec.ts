import {HttpClientModule} from '@angular/common/http';
import {async, TestBed} from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule, MatSelectModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';
import { BrushProperties } from 'src/app/classes/brushProperties/brush-properties';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { LineProperties } from 'src/app/classes/lineProperties/line-properties';
import { PencilProperties } from 'src/app/classes/pencilProperties/pencil-properties';
import { PipetteProperties } from 'src/app/classes/pipetteProperties/pipette-properties';
import { ShapeProperties } from 'src/app/classes/shapeProperties/shape-properties';
import { StampSelectorProperties } from 'src/app/classes/stampProperties/stamp-properties';
import { SvgSelectorProperties } from 'src/app/classes/svgSelectorProperties/svg-properties';
import { ToolBoxPropreties } from 'src/app/classes/toolBoxPropreties/toolsBoxPropreties';
import { HotkeysService } from 'src/app/services/hotkeys/hotkeys.service';
import { environment } from 'src/environments/environment';
import { AirBrushParamsComponent } from '../airbrush-params/airBrush-params.component';
import { BrushParamsComponent } from '../brush-params/brush-params.component';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { DrawingViewComponent } from '../drawingView/drawingView.component';
import { EraserComponent } from '../eraser/eraser.component';
import { FilterTextureComponent } from '../filter-texture/filter-texture.component';
import { GridParamsComponent } from '../grid-params/grid-params.component';
import { LineParamsComponent } from '../line-params/line-params.component';
import { PaintBucketParamsComponent } from '../paint-bucket-params/paint-bucket-params.component';
import { PenToolParamsComponent } from '../pen-tool-params/pen-tool-params.component';
import { PencilParamsComponent } from '../pencil-params/pencil-params.component';
import { PipetteParamsComponent } from '../pipette-params/pipette-params.component';
import { QuillParamsComponent } from '../quill-params/quill-params/quill-params.component';
import { SelectionParamsComponent } from '../selection-params/selection-params.component';
import { ShapeParamsComponent } from '../shape-params/shape-params.component';
import { StampParamsComponent } from '../stamp-params/stamp-params.component';
import { TextParamsComponent } from '../text-params/text-params.component';
import { ToolBoxComponent } from '../tool-box/tool-box.component';
import { UndoRedoParamsComponent } from '../undo-redo-params/undo-redo-params.component';
import { WelcomeWindowComponent } from '../welcome-window/welcome-window.component';
import {AppComponent} from './app.component';
import { MaterialModule } from './material';

describe('AppComponent', () => {
  let mockCookieService: jasmine.SpyObj<CookieService>;
  let component: AppComponent;
  let hotkeysService: HotkeysService;

  beforeEach(() => {
    mockCookieService = jasmine.createSpyObj<CookieService>('CookieService', ['check', 'set', 'get']);
    mockCookieService.set.and.callThrough();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FormsModule,
        MaterialModule,
        MatSelectModule,
        MatListModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebase),
      ],
      declarations: [
        AppComponent,
        WelcomeWindowComponent,
        ToolBoxComponent,
        DrawingViewComponent,
        ColorPickerComponent,
        FilterTextureComponent,
        ColorPaletteComponent,
        UndoRedoParamsComponent,
        EraserComponent,
        StampParamsComponent,
        PipetteParamsComponent,
        GridParamsComponent,
        LineParamsComponent,
        BrushParamsComponent,
        PencilParamsComponent,
        PenToolParamsComponent,
        ShapeParamsComponent,
        SelectionParamsComponent,
        TextParamsComponent,
        PaintBucketParamsComponent,
        AirBrushParamsComponent,
        QuillParamsComponent,
        ColorPickerComponent,
      ],
      providers: [
        CookieService, AppComponent, ColorPickerComponent,
        ShapeProperties, PencilProperties, LineProperties, BrushProperties, PipetteProperties,
        ToolBoxPropreties, ColorToolProperties, StampSelectorProperties, SvgSelectorProperties,
        SelectionParamsComponent, EraserProperties, AngularFireStorage, ColorPickerComponent,
      ],
    });
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [EraserComponent, StampParamsComponent, PipetteParamsComponent, GridParamsComponent,
                          LineParamsComponent, BrushParamsComponent, PencilParamsComponent, ShapeParamsComponent,
                          SelectionParamsComponent, TextParamsComponent, PenToolParamsComponent, PaintBucketParamsComponent,
                          AirBrushParamsComponent, QuillParamsComponent],
      },
    });
    component = TestBed.get(AppComponent);
    hotkeysService = TestBed.get(HotkeysService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('#changeCanvas should change showCanvas to true', () => {
    const isEvent = true;
    component.changeCanvasState(isEvent);
    expect(component.showCanvas).toBe(true);
  });

  it('#ngOnInit should call welcomeWindowActiveChange if the cookie is present', () => {
    spyOn(hotkeysService, 'popupBoolChange');
    component['cookieService'].set('userid', '12345');
    component.ngOnInit();
    expect(hotkeysService.popupBoolChange).toHaveBeenCalled();
  });

  it('#ngOnInit should call welcomeWindowActiveChange if the cookie is present', () => {
    spyOn(hotkeysService, 'popupBoolChange');
    component['cookieService'].set('userid', '23456');
    component.ngOnInit();
    expect(hotkeysService.popupBoolChange).not.toHaveBeenCalled();
  });

  it('#clearCookie should call delete if the cookie is present', () => {
    spyOn(component['cookieService'], 'delete');
    component['cookieService'].set('userid', '12345');
    component.clearCookie();
    expect(component['cookieService'].delete).toHaveBeenCalledWith('userid');
  });

  it('#clearCookie should not call delete if the cookie is present', () => {
    spyOn(component['cookieService'], 'delete');
    component['cookieService'].set('userid', '23456');
    component.clearCookie();
    expect(component['cookieService'].delete).not.toHaveBeenCalledWith('userid');
  });

  it('#mouseWheel should not call mouseWheel and preventDefault when altkey is not pressed', () => {
    const event = new WheelEvent('onwheel', {altKey: false});
    spyOn(component['mouseService'], 'mouseWheel');
    spyOn(event, 'preventDefault');
    component.mouseWheel(event);
    expect(component['mouseService'].mouseWheel).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
  it('#HostListener should call call keyEvent from hotkeyservice', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const event = new KeyboardEvent('keydown', {});
    spyOn(hotkeysService, 'keyEvent');
    component.onKeydownHandler(event);
    expect(hotkeysService.keyEvent).toHaveBeenCalled();
  });
});
