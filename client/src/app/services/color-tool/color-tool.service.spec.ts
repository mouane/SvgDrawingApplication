import { TestBed } from '@angular/core/testing';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { DEFAULT_COLORS } from 'src/app/enum';
import { ConfigureDrawingSizeService } from '../configure-drawing-size/configure-drawing-size';
import { ColorToolService } from './color-tool.service';

describe('ColorToolService', () => {
  let service: ColorToolService;
  const colorProperties = new ColorToolProperties();
  const configureService = new ConfigureDrawingSizeService();
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new ColorToolService(colorProperties, configureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getFill() should be equal to colorTrans', () => {
    expect(service.Fill).toEqual(service['properties'].primary);
  });

  it('#getOutline() should be equal to colorTrans', () => {
    expect(service.Outline).toBe(service['properties'].secondary);
  });

  it('#getBackground() should be equal to colorTrans', () => {
    expect(service.Background).toBe(service['properties'].background);
  });

  it('#setFill() should modity the primary color correctly', () => {
    const newFill = DEFAULT_COLORS.ORANGE;
    service._Fill = newFill;
    expect(service.Fill).toBe(newFill);
  });

  it('#setOutline() should modity the secondary color correctly', () => {
    const newOutline = DEFAULT_COLORS.BLUE;
    service._Outline = newOutline;
    expect(service.Outline).toBe(newOutline);
  });

  it('#setBackground() should modity the background color correctly', () => {
    const newBackground = DEFAULT_COLORS.GREEN;
    service._Background = newBackground;
    expect(service.Background).toBe(newBackground);
  });
});
