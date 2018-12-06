import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { WeatherDisplay } from 'src/app/models/weatherDisplay';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit, OnChanges {

  @Input() weatherDisplay: WeatherDisplay;
  displayValues: boolean;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherDisplay = new WeatherDisplay();
    this.displayValues = false;
  }

  // Use the lifecylce hook here to listen to when the parent is loaded
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (const propName in changes) {
      if (propName === 'weatherDisplay') {
        const changedProp = changes[propName];
        this.weatherDisplay = changedProp.currentValue;
        this.displayValues = true;
      }
    }
  }
}
