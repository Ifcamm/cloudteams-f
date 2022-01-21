import { TestBed } from '@angular/core/testing';

import { MaintenancePlansService } from './maintenance-plans.service';

describe('MaintenancePlansService', () => {
  let service: MaintenancePlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenancePlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
