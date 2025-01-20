import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakingExamComponent } from './taking-exam.component';

describe('TakingExamComponent', () => {
  let component: TakingExamComponent;
  let fixture: ComponentFixture<TakingExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakingExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakingExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
