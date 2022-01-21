import { TestBed } from '@angular/core/testing';

import { MaintenancesPendingService } from './maintenances-pending.service';

describe('MaintenancesPendingService', () => {
  let service: MaintenancesPendingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenancesPendingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
