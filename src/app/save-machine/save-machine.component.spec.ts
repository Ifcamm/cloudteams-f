import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveMachineComponent } from './save-machine.component';

describe('SaveMachineComponent', () => {
  let component: SaveMachineComponent;
  let fixture: ComponentFixture<SaveMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveMachineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
