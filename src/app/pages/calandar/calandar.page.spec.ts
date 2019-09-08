import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalandarPage } from './calandar.page';

describe('CalandarPage', () => {
  let component: CalandarPage;
  let fixture: ComponentFixture<CalandarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalandarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalandarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
