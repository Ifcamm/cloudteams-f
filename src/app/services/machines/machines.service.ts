import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Machine } from 'src/app/models/machine.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

const url = 'http://localhost:3000/api/machines';

@Injectable({
  providedIn: 'root',
})
export class MachinesService {
  machines: Machine[] = [];
  machineUpdated = new Subject<Machine[]>();

  constructor(private router: Router, private http: HttpClient) {}

  createMachine(machine: Machine) {
    this.http.post(`${url}/createmachine`, machine).subscribe((response) => {
      this.router.navigate(['/machines']);
    });
  }

  getMachine(id: string) {
    return this.http.get<{
      _id: String;
      assetcode: String;
      asset: String;
      trademark: String;
      code: String;
      location: String;
      model: String;
      series: String;
      voltage: String;
      measurement: String;
      power: String;
      inventory: String;
      speed: String;
      reference: String;
      capacity: String;
    }>(`${url}/${id}`);
  }

  getMachines() {
    this.http
      .get<any>(`${url}/allmachines`)
      .pipe(
        map((machinesData) => {
          return machinesData.map(
            (machine: {
              _id: String;
              assetcode: String;
              asset: String;
              trademark: String;
              code: String;
              location: String;
              model: String;
              series: String;
              voltage: String;
              measurement: String;
              power: String;
              inventory: String;
              speed: String;
              reference: String;
              capacity: String;
            }) => {
              return {
                id: machine._id,
                assetcode: machine.assetcode,
                asset: machine.asset,
                trademark: machine.trademark,
                code: machine.code,
                location: machine.location,
                model: machine.model,
                series: machine.series,
                voltage: machine.voltage,
                measurement: machine.measurement,
                power: machine.power,
                inventory: machine.inventory,
                speed: machine.speed,
                reference: machine.reference,
                capacity: machine.capacity,
              };
            }
          );
        })
      )
      .subscribe((response) => {
        this.machines = response;
        this.machineUpdated.next([...this.machines]);
      });
  }

  updateMachine(machines: Machine, id: String) {
    this.http.put(`${url}/${id}`, machines).subscribe((response) => {
      const newMaintenance = [...this.machines];
      const oldMintenanceIndex = newMaintenance.findIndex(
        (maintenance) => maintenance.id === id
      );
      newMaintenance[oldMintenanceIndex] = machines;
      this.machineUpdated.next([...this.machines]);
    });
  }

  deleteMachine(id: string) {
    this.http.delete(`${url}/${id}`).subscribe((response) => {
      const machinesFiltered = this.machines.filter(
        (machine) => machine.id != id
      );
      this.machines = machinesFiltered;
      this.machineUpdated.next([...this.machines]);
    });
  }

  getMachinesUpdatedListener() {
    return this.machineUpdated.asObservable();
  }
}
