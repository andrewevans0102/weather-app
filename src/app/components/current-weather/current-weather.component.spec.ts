import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CurrentWeatherComponent } from './current-weather.component';
import { MaterialModule } from '../../modules/material/material.module';
import { HttpClientModule } from '@angular/common/http';

describe('CurrentWeatherComponent', () => {
  let component: CurrentWeatherComponent;
  let fixture: ComponentFixture<CurrentWeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentWeatherComponent ],
      imports: [ MaterialModule, HttpClientModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
