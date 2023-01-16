import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SensorPosition } from '../Sensor';
import { Sensorendata } from '../Sensorendata';
import { BackendService } from '../shared/backend.service';
import { StoreService } from '../shared/store.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Sensorendata>;
  dataSource: MatTableDataSource<Sensorendata>

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['measurementID', 'sensorID', 'name', 'date', 'temperature', 'humidity', 'location', 'position', 'delete'];
  loading = false;

  public get SensorPosition() {return SensorPosition; }

  constructor(private backendService: BackendService, public storeService: StoreService, public snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource();
  }
  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.backendService.getSensoren();
    await this.backendService.getSensorenDaten();
    this.dataSource.data = this.storeService.sensorenDaten;
    this.loading = false;
  }

  async deleteSensordata(id: number) {
    await this.backendService.deleteSensorsDaten(id);
    this.snackBar.open("✅ Measurement successfully deleted")
    await this.ngOnInit();    
  }

  ngAfterViewInit(): void {
    debugger;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
