import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractListComponent } from './contract-list/contract-list.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { LoginComponent } from './login/login.component';
import { MachinesComponent } from './machines/machines.component';
import { MaintenancePlansComponent } from './maintenance-plans/maintenance-plans.component';
import { MaintenancesComponent } from './maintenances/maintenances.component';
import { SaveContractComponent } from './save-contract/save-contract.component';
import { SaveMachineComponent } from './save-machine/save-machine.component';
import { SaveMaintenancePlanComponent } from './save-maintenance-plan/save-maintenance-plan.component';
import { SaveMaintenanceComponent } from './save-maintenance/save-maintenance.component';
import { SaveMaterialComponent } from './save-material/save-material.component';
import { SaveToolComponent } from './save-tool/save-tool.component';
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
  {
    path: 'contracts',
    component: ContractListComponent,
  },
  {
    path: 'contracts/new',
    component: SaveContractComponent,
  },
  {
    path: 'contracts/:id',
    component: SaveContractComponent,
  },
  {
    path: 'contracts/:contractid/addmaterial',
    component: SaveMaterialComponent,
  },
  {
    path: 'contracts/:contractid/addtool',
    component: SaveToolComponent,
  },
  {
    path: 'contracts/:contractid/:materialid',
    component: SaveMaterialComponent,
  },
  {
    path: 'contracts/:contractid/tool/:toolid',
    component: SaveToolComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
