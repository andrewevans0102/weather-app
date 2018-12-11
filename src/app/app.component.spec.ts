import { TestBed, async, ComponentFixture, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';
import { ForecastComponent } from './components/forecast/forecast.component';
import { MaterialModule } from './modules/material/material.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { WeatherService } from './services/weather.service';
import { of } from 'rxjs';
import { WeatherDisplay } from './models/weatherDisplay';
import { DebugElement } from '@angular/core';

describe('AppComponent', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let serviceStub: any;
  let weatherDisplay: WeatherDisplay;
  let weatherService: WeatherService;
  let debugElement: DebugElement;
  let weatherSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CurrentWeatherComponent,
        ForecastComponent
      ],
      providers: [ WeatherService ],
      imports: [
        MaterialModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(AppComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    weatherService = debugElement.injector.get(WeatherService);
    weatherDisplay = {
      'latitude': '37.6584',
      'longitude': '-77.6526',
      'radarStation': 'KAKQ',
      'currentLocation': 'Short Pump, VA',
      'forecastURL': 'https://api.weather.gov/gridpoints/AKQ/36,80/forecast',
      'observationStations': 'https://api.weather.gov/gridpoints/AKQ/36,80/stations',
      'observationsURL': 'https://api.weather.gov/stations/KOFP/observations/latest',
      'currentTemperature': '33',
      'icon': 'https://api.weather.gov/icons/land/day/snow?size=medium',
      'forecast': [
        {
          'number': 1,
          'name': 'This Afternoon',
          'startTime': '2018-12-09T12:00:00-05:00',
          'endTime': '2018-12-09T18:00:00-05:00',
          'isDaytime': true,
          'temperature': 32,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '9 to 13 mph',
          'windDirection': 'NE',
          'icon': 'https://api.weather.gov/icons/land/day/snow,100?size=medium',
          'shortForecast': 'Heavy Snow',
          'detailedForecast': 'Snow. Cloudy, with a high near 32. Northeast wind 9 to 13 mph. Chance of precipitation is 100%. New snow accumulation of 4 to 8 inches possible.'
        },
        {
          'number': 2,
          'name': 'Tonight',
          'startTime': '2018-12-09T18:00:00-05:00',
          'endTime': '2018-12-10T06:00:00-05:00',
          'isDaytime': false,
          'temperature': 26,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '9 to 13 mph',
          'windDirection': 'N',
          'icon': 'https://api.weather.gov/icons/land/night/snow,100/snow,70?size=medium',
          'shortForecast': 'Heavy Snow',
          'detailedForecast': 'Snow before 10pm, then rain and snow likely between 10pm and 4am. Cloudy, with a low around 26. North wind 9 to 13 mph. Chance of precipitation is 100%. New snow accumulation of 3 to 5 inches possible.'
        },
        {
          'number': 3,
          'name': 'Monday',
          'startTime': '2018-12-10T06:00:00-05:00',
          'endTime': '2018-12-10T18:00:00-05:00',
          'isDaytime': true,
          'temperature': 41,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '5 to 8 mph',
          'windDirection': 'N',
          'icon': 'https://api.weather.gov/icons/land/day/sct?size=medium',
          'shortForecast': 'Mostly Sunny',
          'detailedForecast': 'Mostly sunny, with a high near 41. North wind 5 to 8 mph.'
        },
        {
          'number': 4,
          'name': 'Monday Night',
          'startTime': '2018-12-10T18:00:00-05:00',
          'endTime': '2018-12-11T06:00:00-05:00',
          'isDaytime': false,
          'temperature': 24,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '3 mph',
          'windDirection': 'N',
          'icon': 'https://api.weather.gov/icons/land/night/sct?size=medium',
          'shortForecast': 'Partly Cloudy',
          'detailedForecast': 'Partly cloudy, with a low around 24. North wind around 3 mph.'
        },
        {
          'number': 5,
          'name': 'Tuesday',
          'startTime': '2018-12-11T06:00:00-05:00',
          'endTime': '2018-12-11T18:00:00-05:00',
          'isDaytime': true,
          'temperature': 43,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '5 mph',
          'windDirection': 'NW',
          'icon': 'https://api.weather.gov/icons/land/day/few?size=medium',
          'shortForecast': 'Sunny',
          'detailedForecast': 'Sunny, with a high near 43. Northwest wind around 5 mph.'
        },
        {
          'number': 6,
          'name': 'Tuesday Night',
          'startTime': '2018-12-11T18:00:00-05:00',
          'endTime': '2018-12-12T06:00:00-05:00',
          'isDaytime': false,
          'temperature': 24,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '3 mph',
          'windDirection': 'W',
          'icon': 'https://api.weather.gov/icons/land/night/few?size=medium',
          'shortForecast': 'Mostly Clear',
          'detailedForecast': 'Mostly clear, with a low around 24.'
        },
        {
          'number': 7,
          'name': 'Wednesday',
          'startTime': '2018-12-12T06:00:00-05:00',
          'endTime': '2018-12-12T18:00:00-05:00',
          'isDaytime': true,
          'temperature': 45,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '2 mph',
          'windDirection': 'NW',
          'icon': 'https://api.weather.gov/icons/land/day/few?size=medium',
          'shortForecast': 'Sunny',
          'detailedForecast': 'Sunny, with a high near 45.'
        },
        {
          'number': 8,
          'name': 'Wednesday Night',
          'startTime': '2018-12-12T18:00:00-05:00',
          'endTime': '2018-12-13T06:00:00-05:00',
          'isDaytime': false,
          'temperature': 28,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '2 mph',
          'windDirection': 'E',
          'icon': 'https://api.weather.gov/icons/land/night/sct?size=medium',
          'shortForecast': 'Partly Cloudy',
          'detailedForecast': 'Partly cloudy, with a low around 28.'
        },
        {
          'number': 9,
          'name': 'Thursday',
          'startTime': '2018-12-13T06:00:00-05:00',
          'endTime': '2018-12-13T18:00:00-05:00',
          'isDaytime': true,
          'temperature': 47,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '3 mph',
          'windDirection': 'SE',
          'icon': 'https://api.weather.gov/icons/land/day/bkn?size=medium',
          'shortForecast': 'Partly Sunny',
          'detailedForecast': 'Partly sunny, with a high near 47.'
        },
        {
          'number': 10,
          'name': 'Thursday Night',
          'startTime': '2018-12-13T18:00:00-05:00',
          'endTime': '2018-12-14T06:00:00-05:00',
          'isDaytime': false,
          'temperature': 34,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '2 mph',
          'windDirection': 'SE',
          'icon': 'https://api.weather.gov/icons/land/night/rain_showers?size=medium',
          'shortForecast': 'Slight Chance Rain Showers',
          'detailedForecast': 'A slight chance of rain showers after 7pm. Mostly cloudy, with a low around 34.'
        },
        {
          'number': 11,
          'name': 'Friday',
          'startTime': '2018-12-14T06:00:00-05:00',
          'endTime': '2018-12-14T18:00:00-05:00',
          'isDaytime': true,
          'temperature': 56,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '2 to 8 mph',
          'windDirection': 'SE',
          'icon': 'https://api.weather.gov/icons/land/day/rain_showers,50?size=medium',
          'shortForecast': 'Chance Rain Showers',
          'detailedForecast': 'A chance of rain showers. Mostly cloudy, with a high near 56. Chance of precipitation is 50%.'
        },
        {
          'number': 12,
          'name': 'Friday Night',
          'startTime': '2018-12-14T18:00:00-05:00',
          'endTime': '2018-12-15T06:00:00-05:00',
          'isDaytime': false,
          'temperature': 45,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '7 to 10 mph',
          'windDirection': 'S',
          'icon': 'https://api.weather.gov/icons/land/night/rain_showers,50?size=medium',
          'shortForecast': 'Chance Rain Showers',
          'detailedForecast': 'A chance of rain showers. Cloudy, with a low around 45. Chance of precipitation is 50%.'
        },
        {
          'number': 13,
          'name': 'Saturday',
          'startTime': '2018-12-15T06:00:00-05:00',
          'endTime': '2018-12-15T18:00:00-05:00',
          'isDaytime': true,
          'temperature': 54,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '7 mph',
          'windDirection': 'SW',
          'icon': 'https://api.weather.gov/icons/land/day/rain_showers,50/rain_showers,40?size=medium',
          'shortForecast': 'Chance Rain Showers',
          'detailedForecast': 'A chance of rain showers. Partly sunny, with a high near 54. Chance of precipitation is 50%.'
        },
        {
          'number': 14,
          'name': 'Saturday Night',
          'startTime': '2018-12-15T18:00:00-05:00',
          'endTime': '2018-12-16T06:00:00-05:00',
          'isDaytime': false,
          'temperature': 34,
          'temperatureUnit': 'F',
          'temperatureTrend': null,
          'windSpeed': '6 mph',
          'windDirection': 'W',
          'icon': 'https://api.weather.gov/icons/land/night/rain_showers/sct?size=medium',
          'shortForecast': 'Slight Chance Rain Showers then Partly Cloudy',
          'detailedForecast': 'A slight chance of rain showers before 7pm. Partly cloudy, with a low around 34.'
        }
      ]
    };
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function() {
      const position = { coords: { latitude: 37.6584, longitude: -77.6526 } };
      arguments[0](position);
    });
    weatherSpy = spyOn(weatherService, 'getWeather').and.returnValue(weatherDisplay).and.callThrough();
    // weatherSpy = spyOn(weatherService, 'getWeather').and.callFake(function() {
    //   component.weatherDisplay = weatherDisplay;
    //   console.log('Goose');
    // }).and.callThrough();
  }));

  // beforeEach(() => {
  //   httpClient = TestBed.get(HttpClient);
  //   httpTestingController = TestBed.get(HttpTestingController);
  //   fixture = TestBed.createComponent(AppComponent);
  //   debugElement = fixture.debugElement;
  //   component = fixture.componentInstance;
  //   weatherService = debugElement.injector.get(WeatherService);
  //   weatherDisplay = {
  //     'latitude': '37.6584',
  //     'longitude': '-77.6526',
  //     'radarStation': 'KAKQ',
  //     'currentLocation': 'Short Pump, VA',
  //     'forecastURL': 'https://api.weather.gov/gridpoints/AKQ/36,80/forecast',
  //     'observationStations': 'https://api.weather.gov/gridpoints/AKQ/36,80/stations',
  //     'observationsURL': 'https://api.weather.gov/stations/KOFP/observations/latest',
  //     'currentTemperature': '33',
  //     'icon': 'https://api.weather.gov/icons/land/day/snow?size=medium',
  //     'forecast': [
  //       {
  //         'number': 1,
  //         'name': 'This Afternoon',
  //         'startTime': '2018-12-09T12:00:00-05:00',
  //         'endTime': '2018-12-09T18:00:00-05:00',
  //         'isDaytime': true,
  //         'temperature': 32,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '9 to 13 mph',
  //         'windDirection': 'NE',
  //         'icon': 'https://api.weather.gov/icons/land/day/snow,100?size=medium',
  //         'shortForecast': 'Heavy Snow',
  //         'detailedForecast': 'Snow. Cloudy, with a high near 32. Northeast wind 9 to 13 mph. Chance of precipitation is 100%. New snow accumulation of 4 to 8 inches possible.'
  //       },
  //       {
  //         'number': 2,
  //         'name': 'Tonight',
  //         'startTime': '2018-12-09T18:00:00-05:00',
  //         'endTime': '2018-12-10T06:00:00-05:00',
  //         'isDaytime': false,
  //         'temperature': 26,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '9 to 13 mph',
  //         'windDirection': 'N',
  //         'icon': 'https://api.weather.gov/icons/land/night/snow,100/snow,70?size=medium',
  //         'shortForecast': 'Heavy Snow',
  //         'detailedForecast': 'Snow before 10pm, then rain and snow likely between 10pm and 4am. Cloudy, with a low around 26. North wind 9 to 13 mph. Chance of precipitation is 100%. New snow accumulation of 3 to 5 inches possible.'
  //       },
  //       {
  //         'number': 3,
  //         'name': 'Monday',
  //         'startTime': '2018-12-10T06:00:00-05:00',
  //         'endTime': '2018-12-10T18:00:00-05:00',
  //         'isDaytime': true,
  //         'temperature': 41,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '5 to 8 mph',
  //         'windDirection': 'N',
  //         'icon': 'https://api.weather.gov/icons/land/day/sct?size=medium',
  //         'shortForecast': 'Mostly Sunny',
  //         'detailedForecast': 'Mostly sunny, with a high near 41. North wind 5 to 8 mph.'
  //       },
  //       {
  //         'number': 4,
  //         'name': 'Monday Night',
  //         'startTime': '2018-12-10T18:00:00-05:00',
  //         'endTime': '2018-12-11T06:00:00-05:00',
  //         'isDaytime': false,
  //         'temperature': 24,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '3 mph',
  //         'windDirection': 'N',
  //         'icon': 'https://api.weather.gov/icons/land/night/sct?size=medium',
  //         'shortForecast': 'Partly Cloudy',
  //         'detailedForecast': 'Partly cloudy, with a low around 24. North wind around 3 mph.'
  //       },
  //       {
  //         'number': 5,
  //         'name': 'Tuesday',
  //         'startTime': '2018-12-11T06:00:00-05:00',
  //         'endTime': '2018-12-11T18:00:00-05:00',
  //         'isDaytime': true,
  //         'temperature': 43,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '5 mph',
  //         'windDirection': 'NW',
  //         'icon': 'https://api.weather.gov/icons/land/day/few?size=medium',
  //         'shortForecast': 'Sunny',
  //         'detailedForecast': 'Sunny, with a high near 43. Northwest wind around 5 mph.'
  //       },
  //       {
  //         'number': 6,
  //         'name': 'Tuesday Night',
  //         'startTime': '2018-12-11T18:00:00-05:00',
  //         'endTime': '2018-12-12T06:00:00-05:00',
  //         'isDaytime': false,
  //         'temperature': 24,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '3 mph',
  //         'windDirection': 'W',
  //         'icon': 'https://api.weather.gov/icons/land/night/few?size=medium',
  //         'shortForecast': 'Mostly Clear',
  //         'detailedForecast': 'Mostly clear, with a low around 24.'
  //       },
  //       {
  //         'number': 7,
  //         'name': 'Wednesday',
  //         'startTime': '2018-12-12T06:00:00-05:00',
  //         'endTime': '2018-12-12T18:00:00-05:00',
  //         'isDaytime': true,
  //         'temperature': 45,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '2 mph',
  //         'windDirection': 'NW',
  //         'icon': 'https://api.weather.gov/icons/land/day/few?size=medium',
  //         'shortForecast': 'Sunny',
  //         'detailedForecast': 'Sunny, with a high near 45.'
  //       },
  //       {
  //         'number': 8,
  //         'name': 'Wednesday Night',
  //         'startTime': '2018-12-12T18:00:00-05:00',
  //         'endTime': '2018-12-13T06:00:00-05:00',
  //         'isDaytime': false,
  //         'temperature': 28,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '2 mph',
  //         'windDirection': 'E',
  //         'icon': 'https://api.weather.gov/icons/land/night/sct?size=medium',
  //         'shortForecast': 'Partly Cloudy',
  //         'detailedForecast': 'Partly cloudy, with a low around 28.'
  //       },
  //       {
  //         'number': 9,
  //         'name': 'Thursday',
  //         'startTime': '2018-12-13T06:00:00-05:00',
  //         'endTime': '2018-12-13T18:00:00-05:00',
  //         'isDaytime': true,
  //         'temperature': 47,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '3 mph',
  //         'windDirection': 'SE',
  //         'icon': 'https://api.weather.gov/icons/land/day/bkn?size=medium',
  //         'shortForecast': 'Partly Sunny',
  //         'detailedForecast': 'Partly sunny, with a high near 47.'
  //       },
  //       {
  //         'number': 10,
  //         'name': 'Thursday Night',
  //         'startTime': '2018-12-13T18:00:00-05:00',
  //         'endTime': '2018-12-14T06:00:00-05:00',
  //         'isDaytime': false,
  //         'temperature': 34,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '2 mph',
  //         'windDirection': 'SE',
  //         'icon': 'https://api.weather.gov/icons/land/night/rain_showers?size=medium',
  //         'shortForecast': 'Slight Chance Rain Showers',
  //         'detailedForecast': 'A slight chance of rain showers after 7pm. Mostly cloudy, with a low around 34.'
  //       },
  //       {
  //         'number': 11,
  //         'name': 'Friday',
  //         'startTime': '2018-12-14T06:00:00-05:00',
  //         'endTime': '2018-12-14T18:00:00-05:00',
  //         'isDaytime': true,
  //         'temperature': 56,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '2 to 8 mph',
  //         'windDirection': 'SE',
  //         'icon': 'https://api.weather.gov/icons/land/day/rain_showers,50?size=medium',
  //         'shortForecast': 'Chance Rain Showers',
  //         'detailedForecast': 'A chance of rain showers. Mostly cloudy, with a high near 56. Chance of precipitation is 50%.'
  //       },
  //       {
  //         'number': 12,
  //         'name': 'Friday Night',
  //         'startTime': '2018-12-14T18:00:00-05:00',
  //         'endTime': '2018-12-15T06:00:00-05:00',
  //         'isDaytime': false,
  //         'temperature': 45,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '7 to 10 mph',
  //         'windDirection': 'S',
  //         'icon': 'https://api.weather.gov/icons/land/night/rain_showers,50?size=medium',
  //         'shortForecast': 'Chance Rain Showers',
  //         'detailedForecast': 'A chance of rain showers. Cloudy, with a low around 45. Chance of precipitation is 50%.'
  //       },
  //       {
  //         'number': 13,
  //         'name': 'Saturday',
  //         'startTime': '2018-12-15T06:00:00-05:00',
  //         'endTime': '2018-12-15T18:00:00-05:00',
  //         'isDaytime': true,
  //         'temperature': 54,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '7 mph',
  //         'windDirection': 'SW',
  //         'icon': 'https://api.weather.gov/icons/land/day/rain_showers,50/rain_showers,40?size=medium',
  //         'shortForecast': 'Chance Rain Showers',
  //         'detailedForecast': 'A chance of rain showers. Partly sunny, with a high near 54. Chance of precipitation is 50%.'
  //       },
  //       {
  //         'number': 14,
  //         'name': 'Saturday Night',
  //         'startTime': '2018-12-15T18:00:00-05:00',
  //         'endTime': '2018-12-16T06:00:00-05:00',
  //         'isDaytime': false,
  //         'temperature': 34,
  //         'temperatureUnit': 'F',
  //         'temperatureTrend': null,
  //         'windSpeed': '6 mph',
  //         'windDirection': 'W',
  //         'icon': 'https://api.weather.gov/icons/land/night/rain_showers/sct?size=medium',
  //         'shortForecast': 'Slight Chance Rain Showers then Partly Cloudy',
  //         'detailedForecast': 'A slight chance of rain showers before 7pm. Partly cloudy, with a low around 34.'
  //       }
  //     ]
  //   };
  //   spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(function() {
  //     const position = { coords: { latitude: 37.6584, longitude: -77.6526 } };
  //     arguments[0](position);
  //   });
  //   spyOn(weatherService, 'getWeather').and.callFake(function() {
  //     component.weatherDisplay = weatherDisplay;
  //     console.log('Goose');
  //   }).and.callThrough();
  // });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call the location object', fakeAsync((done) => {
    // const position = { coords: { latitude: 32.8569, longitude: -96.9628 } };
    component.ngOnInit();
    flushMicrotasks();
    expect(component.lat).toEqual(weatherDisplay.latitude);
    expect(component.long).toEqual(weatherDisplay.longitude);
    // tick(4000);
    // expect(component.weatherDisplay).toEqual(weatherDisplay);
    weatherSpy.calls.mostRecent().returnValue.then(() => {
      expect(component.weatherDisplay).toEqual(weatherDisplay);
      done();
    });
    // const componentDisplay = component.weatherDisplay;
    // expect(weatherDisplay).toEqual(componentDisplay);
    // expect(component.weatherDisplay).toEqual(this.weatherDisplay);
  }));

});
