import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Machine } from '../models/machine.model';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/users/user.service';
import { MachinesService } from '../services/machines/machines.service';
import { MatSort } from '@angular/material/sort';

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
  dataSource: MatTableDataSource<Machine>;

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
    this.dataSource = new MatTableDataSource(this.machines);
    this.machinesSub = this.machinesService
      .getMachinesUpdatedListener()
      .subscribe((machines: Machine[]) => {
        this.machines = machines;
      });
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.isAuth = this.userService.getIsAuthenticated();
    this.onLogin(this.isAuth);
    this.authSub = this.userService
      .getAuthStatusListener()
      .subscribe((authStatus: boolean) => {
        this.isAuth = authStatus;
        this.onLogin(authStatus);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
          this.dataSource.sort = this.sort;
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
