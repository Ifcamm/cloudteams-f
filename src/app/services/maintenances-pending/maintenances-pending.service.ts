import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Maintenance } from 'src/app/models/maintenance.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

const url = environment.apiUrl + '/maintenances';

@Injectable({
  providedIn: 'root',
})
export class MaintenancesPendingService {
  maintenances: Maintenance[] = [];
  maintenancesUpdated = new Subject<Maintenance[]>();
  maintenanceByAssetcode: Maintenance[] = [];
  maintenancesByAssetcodeUpdated = new Subject<Maintenance[]>();
  maintenancesById: Maintenance[] = [];
  maintenancesByIdUpdated = new Subject<Maintenance[]>();

  private maintenanceId: string = '';
  machineAssetcode: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  getMaintenances() {
    this.http
      .get<any>(`${url}`)
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
                startdate: maintenance.startdate.split('T')[0],
                periodicity: maintenance.periodicity,
                expireStatus: '',
              };
            }
          );
        })
      )
      .subscribe((response) => {
        this.maintenances = response;
        this.maintenances = this.expireFilter(this.maintenances);
        this.maintenancesUpdated.next([...this.maintenances].reverse());
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

  expireFilter(array: Array<any>) {
    let salida = [];
    let now = Date.now();
    for (let i in array) {
      if (array[i].periodicity === 'Semanal') {
        var item = new Date(array[i].startdate).getTime();
        let difference = now - item;
        if (difference > 86400000 * 7) {
          array[i].expireStatus = 'Expired';
          salida.push(array[i]);
        } else if (
          difference + 86400000 * 7 >= 86400000 * 7 &&
          difference > 86400000 * 4
        ) {
          array[i].expireStatus = 'About to expire';
          salida.push(array[i]);
        }
      }

      if (array[i].periodicity === 'Mensual') {
        var item = new Date(array[i].startdate).getTime();
        let difference = now - item;
        if (difference > 86400000 * 30) {
          array[i].expireStatus = 'Expired';
          salida.push(array[i]);
        } else if (
          difference + 86400000 * 7 >= 86400000 * 7 &&
          difference > 86400000 * 7
        ) {
          array[i].expireStatus = 'About to expire';
          salida.push(array[i]);
        }
      }
      if (array[i].periodicity === 'Semestral') {
        var item = new Date(array[i].startdate).getTime();
        let difference = now - item;
        if (difference > 86400000 * 182.5) {
          array[i].expireStatus = 'Expired';
          salida.push(array[i]);
        } else if (
          difference + 86400000 * 7 >= 86400000 * 7 &&
          difference > 86400000 * 7
        ) {
          array[i].expireStatus = 'About to expire';
          salida.push(array[i]);
        }
      }
      if (array[i].periodicity === 'Anual') {
        var item = new Date(array[i].startdate).getTime();
        let difference = now - item;
        if (difference > 86400000 * 365) {
          array[i].expireStatus = 'Expired';
          salida.push(array[i]);
        } else if (
          difference + 86400000 * 7 >= 86400000 * 7 &&
          difference > 86400000 * 7
        ) {
          array[i].expireStatus = 'About to expire';
          salida.push(array[i]);
        }
      }
    }
    return salida;
  }
}
