import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Maintenance } from '../models/maintenance.model';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MaintenanceService } from '../services/maintenances/maintenance.service';
import { UserService } from '../services/users/user.service';

@Component({
  selector: 'app-maintenances',
  templateUrl: './maintenances.component.html',
  styleUrls: ['./maintenances.component.css'],
})
export class MaintenancesComponent implements OnInit {
  maintenancesByAssetcode: Maintenance[] = [];
  maintenancesByAssetcodeSub: Subscription;

  isAuth: boolean = false;
  userRole: string = '';
  authSub!: Subscription;
  dataSource: any;
  machineAssetcode!: string;
  machineId!: string;
  maintenanceId!: string;
  errorMessage = 'Este campo es requerido.';

  maintenance: Maintenance = {
    id: '',
    assetcode: '',
    task: '',
    startdate: '',
    periodicity: '',
  };

  columnsToDisplay = ['id', 'task', 'startdate', 'periodicity', 'actions'];

  constructor(
    public maintenanceService: MaintenanceService,
    public userService: UserService,
    public route: ActivatedRoute
  ) {
    this.maintenancesByAssetcodeSub = this.maintenanceService
      .getMaintenancesByAssetcodeUpdatedListener()
      .subscribe((maintenancesByAssetcode: Maintenance[]) => {
        this.maintenancesByAssetcode = maintenancesByAssetcode;
      });
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit(): void {
    this.isAuth = this.userService.getIsAuthenticated();
    this.onLogin(this.isAuth);
    this.authSub = this.userService
      .getAuthStatusListener()
      .subscribe((authStatus: boolean) => {
        this.isAuth = authStatus;
        this.onLogin(authStatus);
        this.dataSource = new MatTableDataSource<Maintenance>(
          this.maintenancesByAssetcode
        );
        this.dataSource.paginator = this.paginator;
      });
  }

  onLogin(authStatus: boolean) {
    this.userRole = this.userService.getUserRole();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('assetcode')) {
        this.machineAssetcode = paramMap.get('assetcode')!;
      }
    });
    if (authStatus === true) {
      this.maintenanceService.getMaintenanceByAssetcode(this.machineAssetcode);
      this.maintenancesByAssetcodeSub = this.maintenanceService
        .getMaintenancesByAssetcodeUpdatedListener()
        .subscribe((maintenancesByAssetcode: Maintenance[]) => {
          this.maintenancesByAssetcode = maintenancesByAssetcode;
          this.dataSource = new MatTableDataSource<Maintenance>(
            this.maintenancesByAssetcode
          );
          this.dataSource.paginator = this.paginator;
        });
    }
  }

  onDelete(id: string) {
    this.maintenanceService.deleteMaintenance(id);
  }
}
