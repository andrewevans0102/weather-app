import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { WeatherDisplay } from './models/weatherDisplay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'weather-app';
  lat: string;
  long: string;
  weatherDisplay: WeatherDisplay;

  constructor(public weatherService: WeatherService) {}

  ngOnInit(): void {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition((position) => {
        this.savePosition(position);
      });
    } else {
      alert('Browser does not support location finding, showing weather for New York City, NY');
      // When no location is set then default it to New York City
      this.lat = '40.7128';
      this.long = '-74.0060';
    }
  }

  savePosition(position) {
    this.lat = position.coords.latitude.toFixed(4).toString();
    this.long = position.coords.longitude.toFixed(4).toString();

    this.weatherService.getWeather(this.lat, this.long).then(
      function(success) {
        this.weatherDisplay = success;
      }.bind(this),
      function(error) {
        alert(error);
      }
    );
  }

}
