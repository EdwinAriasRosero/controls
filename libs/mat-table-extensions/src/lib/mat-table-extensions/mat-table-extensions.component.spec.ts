import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableExtensionsComponent } from './mat-table-extensions.component';

describe('MatTableExtensionsComponent', () => {
  let component: MatTableExtensionsComponent;
  let fixture: ComponentFixture<MatTableExtensionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTableExtensionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatTableExtensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
