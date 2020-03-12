import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrushProperties } from 'src/app/classes/brushProperties/brush-properties';
import { ColorToolProperties } from 'src/app/classes/colorToolProperties/color-tool-properties';
import { FilterTextureComponent } from './filter-texture.component';

describe('FilterTextureComponent', () => {
  let component: FilterTextureComponent;
  let fixture: ComponentFixture<FilterTextureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTextureComponent ],
      providers: [BrushProperties, ColorToolProperties],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTextureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
