import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from './material/material.module';
import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';
import { HttpClientModule } from '@angular/common/http';
import { ForecastComponent } from './components/forecast/forecast.component';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  declarations: [
    AppComponent,
    CurrentWeatherComponent,
    ForecastComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    MaterialModule,
    HttpClientModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
