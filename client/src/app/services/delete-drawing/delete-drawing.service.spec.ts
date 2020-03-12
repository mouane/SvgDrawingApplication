import { TestBed } from '@angular/core/testing';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { DeleteDrawingService } from './delete-drawing.service';

describe('DeleteDrawingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [HttpClient, HttpHandler],
  }));

  it('should be created', () => {
    const service: DeleteDrawingService = TestBed.get(DeleteDrawingService);
    expect(service).toBeTruthy();
  });
});
