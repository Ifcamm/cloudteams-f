import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPageComponent } from './index-page/index-page.component';
import { LoginComponent } from './login/login.component';
import { MachinesComponent } from './machines/machines.component';
import { MaintenancePlansComponent } from './maintenance-plans/maintenance-plans.component';
import { MaintenancesComponent } from './maintenances/maintenances.component';
import { SaveMachineComponent } from './save-machine/save-machine.component';
import { SaveMaintenancePlanComponent } from './save-maintenance-plan/save-maintenance-plan.component';
import { SaveMaintenanceComponent } from './save-maintenance/save-maintenance.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'index', component: IndexPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'machines', component: MachinesComponent },
  { path: 'machines/new', component: SaveMachineComponent },
  { path: 'machines/edit/:id', component: SaveMachineComponent },
  { path: 'maintenances/:assetcode', component: MaintenancesComponent },

  {
    path: 'maintenances/edit/:id',
    component: SaveMaintenanceComponent,
  },
  { path: 'maintenance/add', component: SaveMaintenanceComponent },
  {
    path: 'maintenanceplans/:assetcode/:id',
    component: MaintenancePlansComponent,
  },
  {
    path: 'maintenanceplans/:assetcode/:workid/new',
    component: SaveMaintenancePlanComponent,
  },
  {
    path: 'maintenanceplans/:assetcode/:workid/:id',
    component: SaveMaintenancePlanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
