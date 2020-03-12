import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { EraserProperties } from 'src/app/classes/eraserProperties/eraser-properties';
import { UndoRedoParamsComponent } from './undo-redo-params.component';

describe('UndoRedoParamsComponent', () => {
  let component: UndoRedoParamsComponent;
  let fixture: ComponentFixture<UndoRedoParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UndoRedoParamsComponent ],
      providers: [EraserProperties],
      imports: [MatIconModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndoRedoParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
