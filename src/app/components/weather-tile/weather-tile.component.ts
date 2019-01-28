import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-tile',
  templateUrl: './weather-tile.component.html',
  styleUrls: ['./weather-tile.component.css']
})
export class WeatherTileComponent implements OnInit {

  title = 'test';

  constructor() { }

  ngOnInit() {
  }

}
