import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { WeatherDisplay } from '../models/weatherDisplay';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  NOAABase = 'https://api.weather.gov';
  weatherDisplay: WeatherDisplay = new WeatherDisplay();

  constructor(private http: HttpClient) { }

  getWeather(lat: string, long: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.weatherDisplay.latitude = lat;
      this.weatherDisplay.longitude = long;

      const metadataPromise = this.getMetadata(lat, long);
      metadataPromise.then(
        function(metadataSuccess) {
          this.weatherDisplay.radarStation = metadataSuccess['properties']['radarStation'];
          const city = metadataSuccess['properties']['relativeLocation']['properties']['city'];
          const state = metadataSuccess['properties']['relativeLocation']['properties']['state'];
          this.weatherDisplay.currentLocation = city + ', ' + state;
          this.weatherDisplay.forecastURL = metadataSuccess['properties']['forecast'];
          this.weatherDisplay.observationStations = metadataSuccess['properties']['observationStations'];

          const radarStationsPromise = this.getRadarStations(this.weatherDisplay.observationStations);
          radarStationsPromise.then(
            function(observationStationsSuccess) {
              // Select the closest radar station to use in call
              const closestStation = this.getRadarStationClosest(observationStationsSuccess['features'], lat, long);
              this.weatherDisplay.observationsURL = closestStation + '/observations/latest';

              // Current Observations
              const observationsPromise = this.getObservations(this.weatherDisplay.observationsURL);
              observationsPromise.then(
                function(observationsSuccess) {
                  const celsius = observationsSuccess['properties']['temperature']['value'];
                  const farenheit = (celsius + (9 / 5) + 32).toFixed(0);
                  this.weatherDisplay.temperature = String(farenheit);
                  this.weatherDisplay.icon = observationsSuccess['properties']['icon'];
                }.bind(this),
                function(error) {
                  alert (error);
                  reject(error);
                }
              );

              // Detailed Forecast
              const detailedForecastPromise = this.getDetailedForecast(this.weatherDisplay.forecastURL);
              detailedForecastPromise.then(
                function(detailedForecastSuccess) {
                  this.weatherDisplay.forecast = detailedForecastSuccess['properties']['periods'];
                }.bind(this),
                function(error) {
                  alert(error);
                  reject(error);
                }
              );

              // Call Promise.all to get all the information at one time
              Promise.all(
                [observationsPromise, detailedForecastPromise])
                .then(
                  function(success) {
                    resolve(this.weatherDisplay);
                  }.bind(this),
                  function(error) {
                    alert(error);
                    reject(error);
                  }
                );
            }.bind(this),
            function(error) {
              alert(error);
              reject(error);
            }
          );
        }.bind(this),
        function(error) {
          alert(error);
          reject(error);
        }
      );
    });
  }

  getMetadata(lat: string, long: string): Promise<any> {
    const NOAAEndpoint = this.NOAABase + '/points/' + lat + ',' + long;
    return this.http.get(NOAAEndpoint)
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
      .toPromise();
  }

  getRadarStations(radarStationsURL: string): Promise<any> {
    return this.http.get(radarStationsURL)
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
      .toPromise();
  }

  getObservations(observationsURL: string): Promise<any> {
    return this.http.get(observationsURL)
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
      .toPromise();
  }

  getDetailedForecast(NOAAEndpoint: string): Promise<any> {
    return this.http.get(NOAAEndpoint)
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
      .toPromise();
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

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
