import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MaintenancePlan } from 'src/app/models/maintenance-plan.model';
import { Maintenance } from 'src/app/models/maintenance.model';

const url = 'http://localhost:3000/api/maintenanceplans';

@Injectable({
  providedIn: 'root',
})
export class MaintenancePlanService {
  maintenance: Maintenance[] = [];
  maintenancesUpdated = new Subject<Maintenance[]>();
  maintenancesByWorkid: MaintenancePlan[] = [];
  maintenancesByWorkidUpdated = new Subject<MaintenancePlan[]>();

  private maintenanceId: string = '';
  machineAssetcode: string = '';
  maintenanceWorkid: string = '';
  task: string = '';
  periodicity: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  createMaintenancePlan(maintenancePlan: MaintenancePlan) {
    this.http
      .post(`${url}/createmaintenanceplan`, maintenancePlan)
      .subscribe((response) => {
        var now = Date.now().toString();
        if (response) {
          this.http
            .get<{
              _id: String;
              assetcode: String;
              task: String;
              startdate: String;
              periodicity: String;
            }>(
              `http://localhost:3000/api/maintenances/maintenance/${maintenancePlan.workid}`
            )
            .subscribe((maintenance) => {
              maintenance.startdate = now;
              this.http
                .put(
                  `http://localhost:3000/api/maintenances/${maintenancePlan.workid}`,
                  maintenance
                )
                .subscribe((response) => {
                  this.maintenancesUpdated.next([...this.maintenance]);
                });
            });
        }
        this.router.navigate([
          '/maintenanceplans',
          localStorage.getItem('machineAssetcode'),
          maintenancePlan.workid,
        ]);
      });
  }

  getMaintenancePlanById(id: string) {
    return this.http.get<{
      _id: String;
      worker: String;
      workid: String;
      periodicity: String;
      date: String;
      starttime: String;
      finishtime: String;
      totaltime: String;
      operationtime: String;
      replacementparts: String;
      ppe: String;
      risks: String;
      assetcode: String;
      task: String;
      taskrange: String;
      result: String;
      observations: String;
    }>(`${url}/mp/${id}`);
  }

  getMaintenancePlansByWorkid(workid: string) {
    this.http
      .get<any>(`${url}/${workid}`)
      .pipe(
        map((maintenancePlansData) => {
          return maintenancePlansData.map(
            (maintenancePlans: {
              _id: String;
              worker: String;
              workid: String;
              periodicity: String;
              date: String;
              starttime: String;
              finishtime: String;
              totaltime: String;
              operationtime: String;
              replacementparts: String;
              ppe: String;
              risks: String;
              assetcode: String;
              task: String;
              taskrange: String;
              result: String;
              observations: String;
            }) => {
              return {
                id: maintenancePlans._id,
                worker: maintenancePlans.worker,
                workid: maintenancePlans.workid,
                periodicity: maintenancePlans.periodicity,
                date: maintenancePlans.date,
                starttime: maintenancePlans.starttime,
                finishtime: maintenancePlans.finishtime,
                totaltime: maintenancePlans.totaltime,
                operationtime: maintenancePlans.operationtime,
                replacementparts: maintenancePlans.replacementparts,
                ppe: maintenancePlans.ppe,
                risks: maintenancePlans.risks,
                assetcode: maintenancePlans.assetcode,
                task: maintenancePlans.task,
                taskrange: maintenancePlans.taskrange,
                result: maintenancePlans.result,
                observations: maintenancePlans.observations,
              };
            }
          );
        })
      )
      .subscribe((response) => {
        this.maintenanceWorkid = workid;
        this.setMaintenanceWorkid(this.maintenanceWorkid);
        this.machineAssetcode = response.assetcode;
        // this.setMachineAssetcode(this.machineAssetcode);
        this.maintenancesByWorkid = response;
        this.maintenancesByWorkidUpdated.next(
          [...this.maintenancesByWorkid].reverse()
        );
        if (response) {
          this.http
            .get<{
              _id: String;
              assetcode: String;
              task: string;
              startdate: String;
              periodicity: string;
            }>(`http://localhost:3000/api/maintenances/maintenance/${workid}`)
            .subscribe((maintenance) => {
              localStorage.setItem('periodicity', maintenance.periodicity)!;
              localStorage.setItem('task', maintenance.task)!;
            });
        }
      });
  }

  updateMaintenancePlan(maintenancePlan: MaintenancePlan, id: String) {
    this.http.put(`${url}/${id}`, maintenancePlan).subscribe((response) => {
      const newMaintenancePlan = [...this.maintenancesByWorkid];
      const oldMintenancePlanIndex = newMaintenancePlan.findIndex(
        (maintenance) => maintenance.id === id
      );
      newMaintenancePlan[oldMintenancePlanIndex] = maintenancePlan;
      this.maintenancesByWorkidUpdated.next([...this.maintenancesByWorkid]);
      // this.router.navigate([`/maintenances/${this.machineAssetcode}`]);
    });
  }

  deleteMaintenancePlan(id: string) {
    this.http.delete(`${url}/${id}`).subscribe((response) => {
      const maintenancePlansFiltered = this.maintenancesByWorkid.filter(
        (maintenance) => maintenance.id != id
      );
      this.maintenancesByWorkid = maintenancePlansFiltered;
      this.maintenancesByWorkidUpdated.next([...this.maintenancesByWorkid]);
      const machineAssetcode = localStorage.getItem('machineAssetcode');
      this.router.navigate([`/maintenances/${machineAssetcode}`]).then(() => {
        window.location.reload();
      });
    });
  }

  getMaintenancePlansUpdatedListener() {
    return this.maintenancesByWorkidUpdated.asObservable();
  }

  getMaintenancePlansByWorkidUpdatedListener() {
    return this.maintenancesByWorkidUpdated.asObservable();
  }

  setMaintenanceWorkid(maintenanceWorkid: string) {
    localStorage.setItem('maintenanceWorkid', maintenanceWorkid);
  }
  getMaintenanceWorkid() {
    const maintenanceWorkid = localStorage.getItem('maintenanceWorkid');
    return this.maintenanceWorkid;
  }

  getMaintenanceTask() {
    const maintenanceWorkid = localStorage.getItem('task');
    return this.task;
  }
  getMaintenancePeriodicity() {
    const maintenanceWorkid = localStorage.getItem('periodicity');
    return this.periodicity;
  }

  // setMachineAssetcode(machineAssetcode: string) {
  //   localStorage.setItem('machineAssetcode', machineAssetcode);
  // }
  // getMachineAssetcode() {
  //   this.machineAssetcode = localStorage.getItem('machineAssetcode')!;
  //   return this.machineAssetcode;
  // }
}
