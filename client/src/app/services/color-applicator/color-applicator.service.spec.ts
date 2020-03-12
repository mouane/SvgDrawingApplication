import { Renderer2 } from '@angular/core';
import { TestBed} from '@angular/core/testing';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { ColorToolService } from 'src/app/services/color-tool/color-tool.service';
import { ColorToolProperties } from '../../classes/colorToolProperties/color-tool-properties';
import { ColorApplicatorService } from './color-applicator.service';

describe('ColorApplicatorService', () => {
  let service: ColorApplicatorService;
  let colorService: ColorToolService;
  let mockRenderer: jasmine.SpyObj<Renderer2>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorApplicatorService, ColorToolService, Renderer2, ColorToolProperties, EraserProperties],
    });
    service = TestBed.get(ColorApplicatorService);
    colorService = TestBed.get(ColorToolService);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['setAttribute']);
    mockRenderer.setAttribute.and.callThrough();
  });

  it('#colorToolService and #colorApplicatorService should be created', () => {
    expect(service).toBeTruthy();
    expect(colorService).toBeTruthy();
  });
});
