import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { WeatherDisplay } from 'src/app/models/weatherDisplay';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit, OnChanges {

  @Input() weatherDisplay: WeatherDisplay;
  displayValues: boolean;

  constructor() { }

  ngOnInit() {
    this.weatherDisplay = new WeatherDisplay();
    this.displayValues = false;
  }

  // Use the lifecylce hook here to listen to when the parent is loaded
  ngOnChanges (changes: {[propKey: string]: SimpleChange}) {
    for (const propName in changes) {
      if (propName === 'weatherDisplay') {
        const changedProp = changes[propName];
        this.weatherDisplay = changedProp.currentValue;
        this.displayValues = true;
      }
    }
  }

}
