import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeMultipleComponent } from './take-multiple.component';

describe('TakeMultipleComponent', () => {
  let component: TakeMultipleComponent;
  let fixture: ComponentFixture<TakeMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeMultipleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
