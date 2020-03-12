import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StampParamsComponent } from './stamp-params.component';

describe('StampParamsComponent', () => {
  let component: StampParamsComponent;
  let fixture: ComponentFixture<StampParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StampParamsComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
