import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsemanagerSidebar } from './hsemanager-sidebar';

describe('HsemanagerSidebar', () => {
  let component: HsemanagerSidebar;
  let fixture: ComponentFixture<HsemanagerSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HsemanagerSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HsemanagerSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
