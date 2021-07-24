import { TestBed, inject } from '@angular/core/testing';

import { SpaceServiceService } from './space-service.service';

describe('SpaceServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpaceServiceService]
    });
  });

  it('should be created', inject([SpaceServiceService], (service: SpaceServiceService) => {
    expect(service).toBeTruthy();
  }));
});
