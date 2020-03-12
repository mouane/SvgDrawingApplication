import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import { MatButtonToggleModule, MatCheckboxModule, MatIconModule } from '@angular/material';
import { COLOR_TEST, DEFAULT_COLORS } from 'src/app/enum';
import { ColorPaletteComponent } from '../color-palette/color-palette.component';
import { SelectionParamsComponent } from '../selection-params/selection-params.component';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let colorPicker: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorPickerComponent, ColorPaletteComponent, SelectionParamsComponent],
      providers: [SelectionParamsComponent],
      imports: [MatIconModule, MatButtonToggleModule, MatCheckboxModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    colorPicker = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(colorPicker).toBeTruthy();
  });

  it('#changeColor() should call #hexToRgba()', () => {
    spyOn(colorPicker, 'hexToRgba');
    colorPicker.changeColor(DEFAULT_COLORS.WHITE);
    expect(colorPicker.hexToRgba).toHaveBeenCalled();
  });

  it('#changeColor() should call unshift', () => {
    const mockColor = 'colorTest';
    spyOn(colorPicker.defaultColors, 'unshift');
    colorPicker.changeColor(mockColor);
    expect(colorPicker.defaultColors.unshift).toHaveBeenCalled();
  });

  it('#changeColorManual() should call #changeColor() when given a valid HEX color', () => {
    spyOn(colorPicker, 'changeColor');
    colorPicker.changeColorManual('vert');
    expect(colorPicker.changeColor).toHaveBeenCalledWith(DEFAULT_COLORS.GREEN);
  });

  it('#changeColorManual() should call #changeColor() when given hex color red', () => {
    spyOn(colorPicker, 'changeColor');
    colorPicker.changeColorManual('rouge');
    expect(colorPicker.changeColor).toHaveBeenCalledWith(DEFAULT_COLORS.RED);
  });

  it('#changeColorManual() should call #changeColor() when given hex color red', () => {
    spyOn(colorPicker, 'changeColor');
    colorPicker.changeColorManual('bleu');
    expect(colorPicker.changeColor).toHaveBeenCalledWith(DEFAULT_COLORS.BLUE);
  });

  it('#changeColorManual() should not call #changeColor() when given an invalid HEX color', () => {
    spyOn(colorPicker, 'changeColor');
    colorPicker.changeColorManual(COLOR_TEST.INVALID_COLOR);
    expect(colorPicker.changeColor).not.toHaveBeenCalledWith(DEFAULT_COLORS.WHITE);
  });

  it('#tranparency() should call #updateColor() when given a valid %', () => {
    spyOn(colorPicker, 'updateColor').and.callThrough();

    colorPicker.transparency(COLOR_TEST.VALID_TRANS);
    expect(colorPicker.updateColor).toHaveBeenCalled();
  });

  it('#tranparency() should not call #updateColor() when given an invalid %', () => {
    spyOn(colorPicker, 'updateColor');

    colorPicker.transparency(COLOR_TEST.INVALID_TRANS);
    expect(colorPicker.updateColor).not.toHaveBeenCalled();
  });

  it('#updateColor() should always call hexToRgba and emit the new colorTrans', () => {
    spyOn(colorPicker, 'hexToRgba');
    colorPicker['toolPropreties'].colorHEX = DEFAULT_COLORS.GRAY;
    colorPicker['toolPropreties'].transHex = COLOR_TEST.TRANS;

    spyOn(colorPicker.outputColor , 'emit');

    colorPicker.updateColor();
    expect(colorPicker.hexToRgba).toHaveBeenCalledWith(colorPicker['toolPropreties'].colorHEX + colorPicker['toolPropreties'].transHex);
    expect(colorPicker.outputColor.emit).toHaveBeenCalledWith(colorPicker['toolPropreties'].colorHEX +
                                                              colorPicker['toolPropreties'].transHex);
  });

  it('#toggleColor() should toggle #isOn', () => {
    expect(colorPicker['toolPropreties'].show).toBe(false, 'off at first');
    colorPicker.toggleColors();
    expect(colorPicker['toolPropreties'].show).toBe(true, 'on after click');
    colorPicker.toggleColors();
    expect(colorPicker['toolPropreties'].show).toBe(false, 'off after second click');
  });

  it('#receiveColorPalette should change color with an event', () => {
    const event = 'red';
    spyOn(colorPicker, 'changeColor');
    colorPicker.receiveColorPalette(event);
    expect(colorPicker.changeColor).toHaveBeenCalledWith(event);
  });

  it('#toggleColors should change show to false', () => {
    colorPicker['toolPropreties'].show = false;
    colorPicker.toggleColors();
    expect(colorPicker['toolPropreties'].show).toBeTruthy();
  });
});
