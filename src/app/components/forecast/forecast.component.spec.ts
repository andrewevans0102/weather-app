import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ForecastComponent } from './forecast.component';
import { HttpClientModule } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { WeatherDisplay } from 'src/app/models/weatherDisplay';
import { MaterialModule } from '../../material/material.module';

describe('ForecastComponent', () => {
  let component: ForecastComponent;
  let fixture: ComponentFixture<ForecastComponent>;
  const weatherDisplay: WeatherDisplay = require('../../../assets/testing/weather-display.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForecastComponent ],
      imports: [ HttpClientModule, MaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('correctly reacts to ngOnChanges lifecycle hook call', () => {
    component.weatherDisplay = weatherDisplay;
    component.ngOnChanges({
      weatherDisplay: new SimpleChange(null, weatherDisplay, true),
    });
    fixture.detectChanges();
    expect(component.weatherDisplay).toBe(weatherDisplay);
  });
});
