import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrentWeatherComponent } from './current-weather.component';
import { HttpClientModule } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { WeatherDisplay } from 'src/app/models/weatherDisplay';
import { MaterialModule } from '../../material/material.module';

describe('CurrentWeatherComponent', () => {
  let component: CurrentWeatherComponent;
  let fixture: ComponentFixture<CurrentWeatherComponent>;
  const weatherDisplay: WeatherDisplay = require('../../../assets/testing/weather-display.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentWeatherComponent ],
      imports: [ HttpClientModule, MaterialModule ]
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

  it('correctly reacts to ngOnChanges lifecycle hook call', () => {
    component.weatherDisplay = weatherDisplay;
    component.ngOnChanges({
      weatherDisplay: new SimpleChange(null, weatherDisplay, true),
    });
    fixture.detectChanges();
    expect(component.weatherDisplay).toBe(weatherDisplay);
  });
});
