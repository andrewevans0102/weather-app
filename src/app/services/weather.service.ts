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
      this.weatherDisplay.radarStation = metadata['properties']['radarStation'];
      const city = metadata['properties']['relativeLocation']['properties']['city'];
      const state = metadata['properties']['relativeLocation']['properties']['state'];
      this.weatherDisplay.currentLocation = city + ', ' + state;
      this.weatherDisplay.forecastURL = metadata['properties']['forecast'];
      this.weatherDisplay.radarStationsURL = metadata['properties']['observationStations'];

      // Select the closest radar station to use in call
      const radarStations = await this.getRadarStations(this.weatherDisplay.radarStationsURL);
      if (radarStations instanceof Error) {
        throw radarStations;
      }
      const closestStation = this.getRadarStationClosest(radarStations['features'], lat, long);
      this.weatherDisplay.observationsURL = closestStation + '/observations/latest';

      const latestObservations = await this.getLatestObservations(this.weatherDisplay.observationsURL);
      if (latestObservations instanceof Error) {
        throw latestObservations;
      }
      const celsius = latestObservations['properties']['temperature']['value'];
      const farenheit = (celsius + (9 / 5) + 32).toFixed(0);
      this.weatherDisplay.currentTemperature = String(farenheit);
      this.weatherDisplay.icon = latestObservations['properties']['icon'];

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

  getMetadata(lat: string, long: string): Promise<any> {
    const metadataURL: string = 'https://api.weather.gov/points/' + lat + ',' + long;
    return this.http.get(metadataURL).toPromise()
      .catch(() => new Error('error when calling metadataURL'));
  }

  getRadarStations(observationsStationsURL): Promise<any> {
    return this.http.get(observationsStationsURL).toPromise()
      .catch(() => new Error('error when calling observationStationsURL'));
  }

  getLatestObservations(observationsURL): Promise<any> {
    return this.http.get(observationsURL).toPromise()
      .catch(() => new Error('error when calling observationsURL'));
  }

  getDetailedForecast(forecastURL): Promise<any> {
    return this.http.get(forecastURL).toPromise()
      .catch(() => new Error('error when calling forecastURL'));
  }

  getRadarStationClosest(observationStations: {}, lat: string, long: string): string {
    const radarStations = <any> observationStations;
    let closestStation = '';
    let firstTime = true;
    let minDistance = 0;

    const x1: number = parseFloat(long);
    const y1: number = parseFloat(lat);

    radarStations.forEach((element) => {
      // when calculating distance use the distance formula
      // sqrt of (x2-x1)^2 + (y2-y1)^2
      // long = x
      // lat = y
      const x2: number = parseFloat(element['geometry']['coordinates'][0]);
      const y2: number = parseFloat(element['geometry']['coordinates'][1]);
      const xSquared: number = (x2 - x1) * (x2 - x1);
      const ySquared: number = (y2 - y1) * (y2 - y1);
      const distance = Math.sqrt(xSquared + ySquared);

      if (firstTime) {
        firstTime = false;
        minDistance = distance;
        closestStation = element['id'];
      } else {
        if (distance < minDistance) {
          minDistance = distance;
          closestStation = element['id'];
        }
      }
    });

    return closestStation;
  }
}
