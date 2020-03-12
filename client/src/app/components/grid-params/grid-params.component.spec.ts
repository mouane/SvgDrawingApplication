import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';
import { MaterialModule } from '../app/material';
import { GridParamsComponent } from './grid-params.component';

describe('GridParamsComponent', () => {
  let component: GridParamsComponent;
  let fixture: ComponentFixture<GridParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridParamsComponent ],
      imports: [MaterialModule, MatCheckboxModule, FormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#updateGrid should call updateGrid from gridConfigService', () => {
    component.gridActivated = true;
    spyOn(component['gridService'], 'updateGrid');
    component.updateGrid();
    expect(component['gridService'].updateGrid).toHaveBeenCalled();
    expect(component['gridService'].gridOpacity).toBe(0.5);
  });
});
