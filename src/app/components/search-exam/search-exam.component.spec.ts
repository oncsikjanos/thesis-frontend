import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchExamComponent } from './search-exam.component';

describe('SearchExamComponent', () => {
  let component: SearchExamComponent;
  let fixture: ComponentFixture<SearchExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
