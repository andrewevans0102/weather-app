import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherDisplay } from '../models/weatherDisplay';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  weatherDisplay: WeatherDisplay = new WeatherDisplay();

  constructor(private http: HttpClient) { }

  async getWeather(lat: string, long: string): Promise<WeatherDisplay> {
    try {
      const metadata: any = await this.getMetadata(lat, long);
      if (metadata instanceof Error) {
        throw metadata;
      }
      this.weatherDisplay.latitude = lat;
      this.weatherDisplay.longitude = long;
      const city = metadata['properties']['relativeLocation']['properties']['city'];
      const state = metadata['properties']['relativeLocation']['properties']['state'];
      this.weatherDisplay.currentLocation = city + ', ' + state;
      this.weatherDisplay.forecastURL = metadata['properties']['forecast'];
      this.weatherDisplay.observationsURL = metadata['properties']['forecastZone'] + '/observations';

      console.log(this.weatherDisplay.observationsURL);

      const latestObservations = await this.getLatestObservations(this.weatherDisplay.observationsURL);
      if (latestObservations instanceof Error) {
        throw latestObservations;
      }
      // when using the zone forecast endpoint only need to pick the first item in the response
      // noaa provides feature observations in a list in order from earliest to latest here
      const latestObservation = latestObservations['features'][0];
      const celsius = latestObservation['properties']['temperature']['value'];
      const farenheit = (celsius + (9 / 5) + 32).toFixed(0);
      this.weatherDisplay.currentTemperature = String(farenheit);
      this.weatherDisplay.icon = latestObservation['properties']['icon'];
      this.weatherDisplay.currentCondition = latestObservation['properties']['textDescription'];
      this.weatherDisplay.radarStationURL = latestObservation['properties']['station'];
      const timestamp = latestObservation['properties']['timestamp'];
      const timestampDate = timestamp.slice(0, 10);
      const timestampTime = timestamp.slice(11, 16);
      const displayDate = this.formatDate(timestampDate);
      const displayTime = this.formatTime(timestampTime);
      this.weatherDisplay.readingTime = displayDate + ', ' + displayTime;

      console.log(this.weatherDisplay.radarStationURL);

      const radarStation = await this.getRadarStation(this.weatherDisplay.radarStationURL);
      if (radarStation instanceof Error) {
        throw radarStation;
      }
      this.weatherDisplay.radarStation = radarStation['properties']['name'];

      const detailedForecast = await this.getDetailedForecast(this.weatherDisplay.forecastURL);
      if (detailedForecast instanceof Error) {
        throw detailedForecast;
      }
      this.weatherDisplay.forecast = detailedForecast['properties']['periods'];
    } catch (error) {
      this.weatherDisplay.errorMessage = error.message;
    }

    return new Promise<WeatherDisplay>((resolve) => {
      resolve(this.weatherDisplay);
    });
  }

  formatDate(timestampDate: string): string {
    const year = timestampDate.slice(0, 4);
    const month = timestampDate.slice(6, 7);
    const day = timestampDate.slice(9, 10);
    const displayDate = month + '/' + day + '/' + year;
    return displayDate;
  }

  formatTime(timestampTime: string): string {
    // time comes in from noaa in GMT format so convert here to eastern standard time
    let hour = Number(timestampTime.slice(0, 2));
    const minute = timestampTime.slice(3, 5);
    hour = hour - 5;
    let displayTime = '';
    if (hour < 12) {
      displayTime = String(hour) + ':' + minute + ' AM';
    } else {
      displayTime = String(hour) + ':' + minute + ' PM';
    }
    return displayTime;
  }

  getMetadata(lat: string, long: string): Promise<any> {
    const metadataURL: string = 'https://api.weather.gov/points/' + lat + ',' + long;
    return this.http.get(metadataURL).toPromise()
      .catch(() => new Error('error when calling metadataURL'));
  }

  getRadarStation(radarStationURL): Promise<any> {
    return this.http.get(radarStationURL).toPromise()
      .catch(() => new Error('error when calling radarStationURL'));
  }

  getLatestObservations(observationsURL): Promise<any> {
    return this.http.get(observationsURL).toPromise()
      .catch(() => new Error('error when calling observationsURL'));
  }

  getDetailedForecast(forecastURL): Promise<any> {
    return this.http.get(forecastURL).toPromise()
      .catch(() => new Error('error when calling forecastURL'));
  }
}
