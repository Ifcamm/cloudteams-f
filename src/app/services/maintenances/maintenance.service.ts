import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Maintenance } from 'src/app/models/maintenance.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

// const url = environment.apiUrl + '/maintenances/allmaintenances';
const url = 'http://localhost:3000/api/maintenances';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  maintenances: Maintenance[] = [];
  maintenancesUpdated = new Subject<Maintenance[]>();
  maintenanceByAssetcode: Maintenance[] = [];
  maintenancesByAssetcodeUpdated = new Subject<Maintenance[]>();
  maintenancesById: Maintenance[] = [];
  maintenancesByIdUpdated = new Subject<Maintenance[]>();

  private maintenanceId: string = '';
  machineAssetcode: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  createMaintenance(maintenance: Maintenance) {
    this.http
      .post(`${url}/createmaintenance`, maintenance)
      .subscribe((response) => {
        this.router.navigate([`/maintenances/${this.machineAssetcode}`]);
      });
  }

  getMaintenance(id: string) {
    return this.http.get<{
      _id: String;
      assetcode: String;
      task: String;
      startdate: String;
      periodicity: String;
    }>(`${url}/maintenance/${id}`);
  }

  getMaintenanceByAssetcode(assetcode: string) {
    this.http
      .get<any>(`${url}/${assetcode}`)
      .pipe(
        map((maintenancesData) => {
          return maintenancesData.map(
            (maintenance: {
              _id: string;
              assetcode: string;
              task: string;
              startdate: string;
              periodicity: string;
            }) => {
              return {
                id: maintenance._id,
                assetcode: maintenance.assetcode,
                task: maintenance.task,
                startdate: maintenance.startdate,
                periodicity: maintenance.periodicity,
              };
            }
          );
        })
      )
      .subscribe((response) => {
        this.maintenanceByAssetcode = response;
        this.machineAssetcode = assetcode;
        this.setMaintenanceData(this.machineAssetcode);
        this.maintenancesByAssetcodeUpdated.next(
          [...this.maintenanceByAssetcode].reverse()
        );
      });
  }

  getMaintenanceById(id: string) {
    this.http
      .get<any>(`${url}/${id}`)
      .pipe(
        map((maintenancesData) => {
          return maintenancesData.map(
            (maintenance: {
              _id: string;
              assetcode: string;
              task: string;
              startdate: string;
              periodicity: string;
            }) => {
              return {
                id: maintenance._id,
                assetcode: maintenance.assetcode,
                task: maintenance.task,
                startdate: maintenance.startdate,
                periodicity: maintenance.periodicity,
              };
            }
          );
        })
      )
      .subscribe((response) => {
        this.maintenanceByAssetcode = response;
        this.maintenancesByAssetcodeUpdated.next(
          [...this.maintenanceByAssetcode].reverse()
        );
      });
  }

  updateMaintenance(maintenance: Maintenance, id: String) {
    this.http.put(`${url}/${id}`, maintenance).subscribe((response) => {
      const newMaintenance = [...this.maintenances];
      const oldMintenanceIndex = newMaintenance.findIndex(
        (maintenance) => maintenance.id === id
      );
      newMaintenance[oldMintenanceIndex] = maintenance;
      this.maintenancesUpdated.next([...this.maintenances]);
      this.router.navigate([`/maintenances/${this.machineAssetcode}`]);
    });
  }

  deleteMaintenance(id: string) {
    this.http.delete(`${url}/${id}`).subscribe((response) => {
      const maintenancesFiltered = this.maintenances.filter(
        (maintenance) => maintenance.id != id
      );
      this.maintenances = maintenancesFiltered;
      this.maintenancesUpdated.next([...this.maintenances]);
      this.router
        .navigate([`/maintenances/${this.machineAssetcode}`])
        .then(() => {
          window.location.reload();
        });
    });
  }

  getMaintenancesUpdatedListener() {
    return this.maintenancesUpdated.asObservable();
  }

  getMaintenancesByAssetcodeUpdatedListener() {
    return this.maintenancesByAssetcodeUpdated.asObservable();
  }

  getMaintenancesByIdUpdatedListener() {
    return this.maintenancesByIdUpdated.asObservable();
  }

  setMaintenanceData(machineAssetcode: string) {
    localStorage.setItem('machineAssetcode', machineAssetcode);
  }
  getMaintenanceData() {
    const machineAssetcode = localStorage.getItem('machineAssetcode');
    return this.machineAssetcode;
  }
}
