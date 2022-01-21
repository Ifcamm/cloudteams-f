import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenancePlansComponent } from './maintenance-plans.component';

describe('MaintenancePlansComponent', () => {
  let component: MaintenancePlansComponent;
  let fixture: ComponentFixture<MaintenancePlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenancePlansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenancePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
