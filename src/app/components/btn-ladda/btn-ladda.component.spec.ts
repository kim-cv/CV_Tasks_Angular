import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnLaddaComponent } from './btn-ladda.component';

describe('BtnLaddaComponent', () => {
  let component: BtnLaddaComponent;
  let fixture: ComponentFixture<BtnLaddaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnLaddaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnLaddaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
