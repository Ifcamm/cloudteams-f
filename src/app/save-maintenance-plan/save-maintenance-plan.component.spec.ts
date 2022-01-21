import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveMaintenancePlanComponent } from './save-maintenance-plan.component';

describe('SaveMaintenancePlanComponent', () => {
  let component: SaveMaintenancePlanComponent;
  let fixture: ComponentFixture<SaveMaintenancePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveMaintenancePlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveMaintenancePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
