import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/users/user.service';

import { Contract } from '../models/contract.model';
import { ContractsService } from '../services/contracts/contracts.service';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.css'],
})
export class ContractListComponent implements OnInit, OnDestroy {
  contracts: Contract[] = [];
  contractsSub: Subscription;

  isAuth: boolean = false;
  userRole: string = '';
  authSub!: Subscription;
  dataSource: MatTableDataSource<Contract>;

  columnsToDisplay = [
    'title',
    'asset',
    'process',
    'assetOrCriticComponent',
    'actions',
  ];

  constructor(
    public contractsService: ContractsService,
    public userService: UserService,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(this.contracts);
    this.contractsSub = this.contractsService
      .getContractsUpdatedListener()
      .subscribe((contracts: Contract[]) => {
        this.contracts = contracts;
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
    if (authStatus === true) {
      this.contractsService.getContracts();
      this.contractsSub = this.contractsService
        .getContractsUpdatedListener()
        .subscribe((contracts: Contract[]) => {
          this.contracts = contracts;
          this.dataSource = new MatTableDataSource<Contract>(this.contracts);
          this.dataSource.paginator = this.paginator;
        });
    }
  }

  ngOnDestroy(): void {
    this.contractsSub.unsubscribe();
  }

  onDelete(id: string) {
    this.contractsService.deleteContract(id);
  }
}
