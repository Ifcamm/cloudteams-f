import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Maintenance } from '../models/maintenance.model';
import { MaintenanceService } from '../services/maintenances/maintenance.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-save-maintenance',
  templateUrl: './save-maintenance.component.html',
  styleUrls: ['./save-maintenance.component.css'],
})
export class SaveMaintenanceComponent implements OnInit {
  private isEditing = false;
  private maintenanceId!: string;
  machineAssetcode: string = this.maintenanceService.getMaintenanceData();
  errorMessage = 'Este campo es requerido.';

  maintenance: Maintenance = {
    id: '',
    assetcode: '',
    task: '',
    startdate: '',
    periodicity: '',
  };
  maintenancesUpdated = new Subject<Maintenance[]>();

  constructor(
    private router: Router,
    public maintenanceService: MaintenanceService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.isEditing = true;
        this.machineAssetcode = this.maintenanceService.getMaintenanceData();
        this.maintenanceId = paramMap.get('id')!;
        this.maintenanceService
          .getMaintenance(this.maintenanceId)
          .subscribe((maintenanceData) => {
            this.maintenance = {
              id: maintenanceData._id,
              assetcode: maintenanceData.assetcode,
              task: maintenanceData.task,
              startdate: maintenanceData.startdate,
              periodicity: maintenanceData.periodicity,
            };
          });
      } else {
        this.isEditing = false;
        this.maintenanceId = null!;
      }
    });
  }
  saveMaintenance(form: NgForm) {
    if (form.invalid) {
      console.log('Formulario inválido');
      return;
    }

    if (this.isEditing) {
      this.maintenanceService.updateMaintenance(form.value, this.maintenanceId);
    } else {
      console.log(form.value);
      this.maintenanceService.createMaintenance(form.value);
    }

    form.resetForm();
  }
  getErrorMessage() {
    return this.errorMessage;
  }
  getMaintenancesByAssetcodeUpdatedListener() {
    return this.maintenancesUpdated.asObservable();
  }
}
