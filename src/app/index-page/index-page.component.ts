import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Maintenance } from '../models/maintenance.model';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MaintenanceService } from '../services/maintenances/maintenance.service';
import { UserService } from '../services/users/user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MaintenancesPendingService } from '../services/maintenances-pending/maintenances-pending.service';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.css'],
})
export class IndexPageComponent implements OnInit, OnDestroy {
  maintenances: Maintenance[] = [];
  maintenancesSub: Subscription;

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

  columnsToDisplay = [
    'assetcode',
    'task',
    'startdate',
    'periodicity',
    'status',
    'actions',
  ];

  constructor(
    // public maintenanceService: MaintenanceService,
    public maintenancesPendingService: MaintenancesPendingService,
    public userService: UserService,
    public route: ActivatedRoute
  ) {
    this.maintenancesSub = this.maintenancesPendingService
      .getMaintenancesUpdatedListener()
      .subscribe((maintenances: Maintenance[]) => {
        this.maintenances = maintenances;
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
          this.maintenances
        );
        this.dataSource.paginator = this.paginator;
      });
  }

  onLogin(authStatus: boolean) {
    this.userRole = this.userService.getUserRole();

    if (authStatus === true && this.userRole === 'superuser') {
      this.maintenancesPendingService.getMaintenances();
      this.maintenancesSub = this.maintenancesPendingService
        .getMaintenancesUpdatedListener()
        .subscribe((maintenances: Maintenance[]) => {
          this.maintenances = maintenances;
          this.dataSource = new MatTableDataSource<Maintenance>(
            this.maintenances
          );
          this.dataSource.paginator = this.paginator;
        });
    }
  }

  onDelete(id: string) {
    this.maintenancesPendingService.deleteMaintenance(id);
  }

  ngOnDestroy(): void {
    // this.maintenancesSub.unsubscribe();
    this.maintenancesSub.unsubscribe();
  }
}
