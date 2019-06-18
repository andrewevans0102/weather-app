import { TestBed, async, ComponentFixture, fakeAsync, flushMicrotasks, tick} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';
import { ForecastComponent } from './components/forecast/forecast.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WeatherService } from './services/weather.service';
import { WeatherDisplay } from './models/weatherDisplay';
import { DebugElement } from '@angular/core';
import { MaterialModule } from './material/material.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const weatherDisplay: WeatherDisplay = require('../assets/testing/weather-display.json');
  let weatherService: WeatherService;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CurrentWeatherComponent,
        ForecastComponent
      ],
      providers: [ WeatherService ],
      imports: [
        HttpClientTestingModule, MaterialModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    weatherService = debugElement.injector.get(WeatherService);
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call the HTML5 geolocation api and return coordinates', fakeAsync(() => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function() {
      const position = { coords: { latitude: 1234.0000, longitude: 5678.0000 } };
      arguments[0](position);
    });
    component.ngOnInit();
    flushMicrotasks();
    expect(component.lat).toEqual('1234.0000');
    expect(component.long).toEqual('5678.0000');
  }));

  it('should call the HTML5 geolocation api and return error when not supported', fakeAsync(() => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.returnValue(null);
    component.ngOnInit();
    flushMicrotasks();
    expect(component.lat).toEqual(undefined);
    expect(component.long).toEqual(undefined);
  }));

  it('should populate the weatherDisplay value when WeatherService is called', fakeAsync(() => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function() {
      const position = { coords: { latitude: 37.6584, longitude: -77.6526 } };
      arguments[0](position);
    });
    spyOn(weatherService, 'getWeather').and.returnValue(Promise.resolve(weatherDisplay));
    component.ngOnInit();
    flushMicrotasks();
    expect(component.weatherDisplay).toEqual(weatherDisplay);
  }));

  it('should catch error when problem with WeatherService', fakeAsync(() => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function() {
      const position = { coords: { latitude: 37.6584, longitude: -77.6526 } };
      arguments[0](position);
    });
    spyOn(weatherService, 'getWeather').and.returnValue(Promise.reject('error'));
    component.ngOnInit();
    flushMicrotasks();
    expect(component.weatherDisplay.latitude).toBe(undefined);
    expect(component.weatherDisplay.longitude).toBe(undefined);
  }));
});
