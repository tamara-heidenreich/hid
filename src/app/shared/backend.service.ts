import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Sensor } from '../Sensor';
import { Sensorendata } from '../Sensorendata';
import { SensorendataResponse } from '../SensorendataResponse';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private storeService: StoreService, private http: HttpClient) { }

  sensoren: Sensor[] = [];

  public async getSensoren() {
    this.sensoren = await firstValueFrom(this.http.get<Sensor[]>('http://localhost:5000/sensors'));
    this.storeService.sensoren = this.sensoren;
  }

  public async getSensorenDaten() {
    const sensorenDataResponse = await firstValueFrom(this.http.get<SensorendataResponse[]>(`http://localhost:5000/sensorsData`));
    const sensorenData: Sensorendata[]= sensorenDataResponse.map(data => {
      const sensor: Sensor = this.sensoren.filter(sensor => sensor.id == data.sensorId)[0];
      return { ...data, sensor }
    });
    this.storeService.sensorenDaten = sensorenData;
  }

  public async addSensorsData(sensorenData: Sensorendata[]) {
    await firstValueFrom(this.http.post('http://localhost:5000/sensorsData', sensorenData));
    await this.getSensorenDaten();
  }

  public async deleteSensorsDaten(sensorId: number) {
    await firstValueFrom(this.http.delete(`http://localhost:5000/sensorsData/${sensorId}`));
    await this.getSensorenDaten();
  }
}
