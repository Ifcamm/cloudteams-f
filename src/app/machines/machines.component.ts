import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Machine } from '../models/machine.model';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/users/user.service';
import { MachinesService } from '../services/machines/machines.service';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.css'],
})
export class MachinesComponent implements OnInit, OnDestroy {
  machines: Machine[] = [];
  machinesSub: Subscription;

  isAuth: boolean = false;
  userRole: string = '';
  authSub!: Subscription;
  dataSource: any;

  columnsToDisplay = [
    'id',
    'assetcode',
    'asset',
    'trademark',
    'model',
    'series',
    'actions',
  ];

  constructor(
    public machinesService: MachinesService,
    public userService: UserService,
    public dialog: MatDialog
  ) {
    this.machinesSub = this.machinesService
      .getMachinesUpdatedListener()
      .subscribe((machines: Machine[]) => {
        this.machines = machines;
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
        this.dataSource = new MatTableDataSource<Machine>(this.machines);
        this.dataSource.paginator = this.paginator;
      });
  }

  onLogin(authStatus: boolean) {
    this.userRole = this.userService.getUserRole();
    if (authStatus === true && this.userRole === 'superuser') {
      this.machinesService.getMachines();
      this.machinesSub = this.machinesService
        .getMachinesUpdatedListener()
        .subscribe((machines: Machine[]) => {
          this.machines = machines;
          this.dataSource = new MatTableDataSource<Machine>(this.machines);
          this.dataSource.paginator = this.paginator;
        });
    }
  }

  ngOnDestroy(): void {
    this.machinesSub.unsubscribe();
  }

  onDelete(id: string) {
    this.machinesService.deleteMachine(id);
  }
}
