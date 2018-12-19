import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { WeatherDisplay } from './models/weatherDisplay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  lat: string;
  long: string;
  weatherDisplay: WeatherDisplay = new WeatherDisplay();

  constructor(public weatherService: WeatherService) { }

  ngOnInit(): void {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        this.savePosition(position);
      });
    } catch (error) {
      alert('Browser does not support location services');
    }
  }

  savePosition(position) {
    this.lat = position.coords.latitude.toFixed(4).toString();
    this.long = position.coords.longitude.toFixed(4).toString();

      this.weatherService.getWeather(this.lat, this.long)
      .then(
        function(success) {
          this.weatherDisplay = success;
          if (this.weatherDisplay.errorMessage !== undefined) {
            alert(this.weatherDisplay.errorMessage);
          }
        }.bind(this),
        function(error) {
          alert(error);
          this.weatherDisplay = new WeatherDisplay();
        }.bind(this)
      );
  }

}
