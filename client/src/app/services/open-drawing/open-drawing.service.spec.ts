import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpTestingController} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrushProperties } from 'src/app/classes/brushProperties/brush-properties';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { LineProperties } from 'src/app/classes/lineProperties/line-properties';
import { OpenDrawingProperties } from 'src/app/classes/openDrawingProperties/open-drawing-properties';
import { PencilProperties } from 'src/app/classes/pencilProperties/pencil-properties';
import { PenToolProperties } from 'src/app/classes/penProperties/pen-properties';
import { PipetteProperties } from 'src/app/classes/pipetteProperties/pipette-properties';
import { ShapeProperties } from 'src/app/classes/shapeProperties/shape-properties';
import { StampSelectorProperties } from 'src/app/classes/stampProperties/stamp-properties';
import { SvgSelectorProperties } from 'src/app/classes/svgSelectorProperties/svg-properties';
import { SvgShapeElements } from 'src/app/classes/svgShapeElements/svg-shape-elements';
import { TextProperties } from 'src/app/classes/textProperties/textProperties';
import { OpenDrawingService } from './open-drawing.service';

describe('OpenDrawingService', () => {
  let service: OpenDrawingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, ColorToolProperties, ShapeProperties, SvgShapeElements,
        PenToolProperties, BrushProperties, PipetteProperties, LineProperties, StampSelectorProperties,
        SvgSelectorProperties, TextProperties, OpenDrawingProperties, PencilProperties, EraserProperties,
        HttpTestingController],
    });
    service = TestBed.get(OpenDrawingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#loadDrawing should ask user if they want to abandon the current drawing when something drawn', () => {
    spyOn(window, 'confirm');
    service['mouseServ'].drawingContainsElement = true;
    service.loadDrawing();
    expect(window.confirm).toHaveBeenCalledWith('Etes-vous sur de vouloir abandonner le dessin courant');
  });

  it('#loadDrawing should not ask user if they want to abandon the current drawing when drawing empty', () => {
    spyOn(window, 'confirm');
    service['mouseServ'].drawingContainsElement = false;
    service.loadDrawing();
    expect(window.confirm).not.toHaveBeenCalled();
  });
});
