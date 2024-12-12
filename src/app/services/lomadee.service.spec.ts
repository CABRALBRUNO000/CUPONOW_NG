import { TestBed } from '@angular/core/testing';

import { LomadeeService } from './lomadee.service';

describe('LomadeeService', () => {
  let service: LomadeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LomadeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
