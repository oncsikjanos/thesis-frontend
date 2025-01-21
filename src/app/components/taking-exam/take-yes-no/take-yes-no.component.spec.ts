import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeYesNoComponent } from './take-yes-no.component';

describe('TakeYesNoComponent', () => {
  let component: TakeYesNoComponent;
  let fixture: ComponentFixture<TakeYesNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeYesNoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeYesNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
