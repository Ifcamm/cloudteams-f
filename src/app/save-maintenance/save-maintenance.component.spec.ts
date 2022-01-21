import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveMaintenanceComponent } from './save-maintenance.component';

describe('SaveMaintenanceComponent', () => {
  let component: SaveMaintenanceComponent;
  let fixture: ComponentFixture<SaveMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
