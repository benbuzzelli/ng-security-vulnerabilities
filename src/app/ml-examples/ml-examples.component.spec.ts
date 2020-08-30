import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MlExamplesComponent } from './ml-examples.component';

describe('MlExamplesComponent', () => {
  let component: MlExamplesComponent;
  let fixture: ComponentFixture<MlExamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MlExamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MlExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
