import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphsStofferComponent } from './graphs-stoffer.component';

describe('GraphsStofferComponent', () => {
  let component: GraphsStofferComponent;
  let fixture: ComponentFixture<GraphsStofferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphsStofferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphsStofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
