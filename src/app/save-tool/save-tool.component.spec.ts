import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveToolComponent } from './save-tool.component';

describe('SaveToolComponent', () => {
  let component: SaveToolComponent;
  let fixture: ComponentFixture<SaveToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
