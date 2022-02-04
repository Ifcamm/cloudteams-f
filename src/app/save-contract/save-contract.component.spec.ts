import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveContractComponent } from './save-contract.component';

describe('SaveContractComponent', () => {
  let component: SaveContractComponent;
  let fixture: ComponentFixture<SaveContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
