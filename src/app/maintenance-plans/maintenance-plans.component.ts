import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaintenancePlan } from '../models/maintenance-plan.model';
import { MaintenancePlanService } from '../services/maintenance-plans/maintenance-plans.service';
import { UserService } from '../services/users/user.service';
@Component({
  selector: 'app-maintenance-plans',
  templateUrl: './maintenance-plans.component.html',
  styleUrls: ['./maintenance-plans.component.css'],
})
export class MaintenancePlansComponent implements OnInit {
  maintenanceWorkid!: string;
  maintenancePlansByWorkid: MaintenancePlan[] = [];
  machineAssetcode!: string;
  maintenanceByWorkidSub!: Subscription;
  dataSource: any;
  isAuth: boolean = false;
  authSub!: Subscription;

  columnsToDisplay = ['machine', 'task', 'worker', 'date', 'actions'];

  constructor(
    private router: Router,
    public userService: UserService,
    public maintenancePlanService: MaintenancePlanService,
    public route: ActivatedRoute
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit(): void {
    this.isAuth = this.userService.getIsAuthenticated();
    this.onLogin(this.isAuth);
    this.authSub = this.userService
      .getAuthStatusListener()
      .subscribe((authStatus: boolean) => {
        this.isAuth = authStatus;
        this.onLogin(authStatus);
        this.dataSource = new MatTableDataSource<MaintenancePlan>(
          this.maintenancePlansByWorkid
        );
        this.dataSource.paginator = this.paginator;
      });
  }

  onLogin(authStatus: boolean) {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id') && paramMap.has('assetcode')) {
        this.maintenanceWorkid = paramMap.get('id')!;
        this.machineAssetcode = paramMap.get('assetcode')!;
        localStorage.setItem('machineAssetcode', this.machineAssetcode);
        this.maintenancePlanService.getMaintenancePlansByWorkid(
          this.maintenanceWorkid
        );
        this.maintenanceByWorkidSub = this.maintenancePlanService
          .getMaintenancePlansByWorkidUpdatedListener()
          .subscribe((maintenancePlansByWorkid: MaintenancePlan[]) => {
            this.maintenancePlansByWorkid = maintenancePlansByWorkid;
            this.dataSource = new MatTableDataSource<MaintenancePlan>(
              this.maintenancePlansByWorkid
            );
            this.dataSource.paginator = this.paginator;
          });
      }
    });
  }
  onDelete(id: string) {
    this.maintenancePlanService.deleteMaintenancePlan(id);
  }
}
