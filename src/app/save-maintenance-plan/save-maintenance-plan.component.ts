import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MaintenancePlan } from '../models/maintenance-plan.model';
import { MaintenancePlanService } from '../services/maintenance-plans/maintenance-plans.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MaintenanceService } from '../services/maintenances/maintenance.service';

@Component({
  selector: 'app-save-maintenance-plan',
  templateUrl: './save-maintenance-plan.component.html',
  styleUrls: ['./save-maintenance-plan.component.css'],
})
export class SaveMaintenancePlanComponent implements OnInit {
  private isEditing = false;
  maintenancePlanId!: string;
  machineAssetcode: string = localStorage.getItem('machineAssetcode')!;
  maintenanceWorkid: string = localStorage.getItem('maintenanceWorkid')!;
  taskLS: string = localStorage.getItem('task')!;
  periodicityLS: string = localStorage.getItem('periodicity')!;

  maintenancePlan: MaintenancePlan = {
    id: '',
    worker: '',
    workid: '',
    periodicity: '',
    date: '',
    starttime: '',
    finishtime: '',
    totaltime: '',
    operationtime: '',
    replacementparts: '',
    ppe: '',
    risks: '',
    assetcode: '',
    task: '',
    taskrange: '',
    result: '',
    observations: '',
  };

  maintenancesPlanUpdated = new Subject<MaintenancePlan[]>();

  constructor(
    private router: Router,
    public maintenancePlanService: MaintenancePlanService,
    public maintenanceService: MaintenanceService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.taskLS = localStorage.getItem('task')!;
        this.periodicityLS = localStorage.getItem('periodicity')!;
        this.isEditing = true;
        this.maintenancePlanId = paramMap.get('id')!;
        this.maintenancePlanService
          .getMaintenancePlanById(this.maintenancePlanId)
          .subscribe(
            (maintenancePlanData) =>
              (this.maintenancePlan = {
                id: maintenancePlanData._id,
                worker: maintenancePlanData.worker,
                workid: maintenancePlanData.workid,
                periodicity: maintenancePlanData.periodicity,
                date: maintenancePlanData.date,
                starttime: maintenancePlanData.starttime,
                finishtime: maintenancePlanData.finishtime,
                totaltime: maintenancePlanData.totaltime,
                operationtime: maintenancePlanData.operationtime,
                replacementparts: maintenancePlanData.replacementparts,
                ppe: maintenancePlanData.ppe,
                risks: maintenancePlanData.risks,
                assetcode: maintenancePlanData.assetcode,
                task: maintenancePlanData.task,
                taskrange: maintenancePlanData.taskrange,
                result: maintenancePlanData.result,
                observations: maintenancePlanData.observations,
              })
          );
      }
    });
  }
  saveMaintenancePlan(form: NgForm) {
    if (form.invalid) {
      console.log('Formulario inválido');
      return;
    }

    if (this.isEditing) {
      this.maintenancePlanService.updateMaintenancePlan(
        form.value,
        this.maintenancePlanId
      );
    } else {
      this.maintenancePlanService.createMaintenancePlan(form.value);
    }
    form.resetForm();
  }
}
