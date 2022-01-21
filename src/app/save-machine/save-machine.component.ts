import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Machine } from '../models/machine.model';
import { MachinesService } from '../services/machines/machines.service';

@Component({
  selector: 'app-save-machine',
  templateUrl: './save-machine.component.html',
  styleUrls: ['./save-machine.component.css'],
})
export class SaveMachineComponent implements OnInit {
  private isEditing = false;
  private machineId!: string;
  private machineAssetcode!: string;
  errorMessage = 'Este campo es requerido.';
  machine: Machine = {
    id: '',
    assetcode: '',
    asset: '',
    trademark: '',
    code: '',
    location: '',
    model: '',
    series: '',
    voltage: '',
    measurement: '',
    power: '',
    inventory: '',
    speed: '',
    reference: '',
    capacity: '',
  };

  constructor(
    public machinesService: MachinesService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.isEditing = true;
        this.machineId = paramMap.get('id')!;
        // this.machineAssetcode = paramMap.get('assetcode')!;
        this.machinesService
          .getMachine(this.machineId)
          .subscribe((machineData) => {
            this.machine = {
              id: machineData._id,
              assetcode: machineData.assetcode,
              asset: machineData.asset,
              trademark: machineData.trademark,
              code: machineData.code,
              location: machineData.location,
              model: machineData.model,
              series: machineData.series,
              voltage: machineData.voltage,
              measurement: machineData.measurement,
              power: machineData.power,
              inventory: machineData.inventory,
              speed: machineData.speed,
              reference: machineData.reference,
              capacity: machineData.capacity,
            };
            console.log(this.machine);
          });
      } else {
        this.isEditing = false;
        this.machineId = null!;
      }
    });
  }

  saveMachine(form: NgForm) {
    if (form.invalid) {
      console.log('Formulario inválido');
      return;
    }

    if (this.isEditing) {
      this.machinesService.updateMachine(form.value, this.machineId);
    } else {
      this.machinesService.createMachine(form.value);
    }

    form.resetForm();
  }
  getErrorMessage() {
    return this.errorMessage;
  }
}
