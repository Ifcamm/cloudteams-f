import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contract } from '../models/contract.model';
import { Material } from '../models/material.model';
import { Tool } from '../models/tool.model';
import { ContractsService } from '../services/contracts/contracts.service';
import { UserService } from '../services/users/user.service';

@Component({
  selector: 'app-save-contract',
  templateUrl: './save-contract.component.html',
  styleUrls: ['./save-contract.component.css'],
})
export class SaveContractComponent implements OnInit {
  materials: Material[] = [];
  materialSub: Subscription;
  tools: Tool[] = [];
  toolsSub: Subscription;

  isAuth: boolean = false;
  isEditing = false;
  userRole: string = '';
  private contractId!: string;
  dataSourceMaterial: MatTableDataSource<Material>;
  dataSourceTool: MatTableDataSource<Tool>;
  contractsSub!: Subscription;

  dataSource: MatTableDataSource<Material>;

  columnsToDisplay = ['sapCode', 'sparePart', 'units', 'actions'];
  columnsToDisplayTools = ['tools', 'actions'];

  errorMessage = 'Este campo es requerido.';
  contract: Contract = {
    id: '',
    title: '',
    business: '',
    process: '',
    numberOfMachines: '',
    line: '',
    date: '',
    asset: '',
    system: '',
    assetOrCriticComponent: '',
    inventory: '',
    systemFunction: '',
    failtureMode: '',
    faultureOrigin: '',
    operationalCheckList: '',
    preventivePlans: '',
    predictivePlans: '',
    category: '',
    workPlace: '',
    frecuency: '',
    lineCondition: '',
    hm: '',
    description: '',
  };

  constructor(
    public contractsService: ContractsService,
    public userService: UserService,
    public route: ActivatedRoute
  ) {
    this.dataSourceMaterial = new MatTableDataSource(this.materials);
    this.materialSub = this.contractsService
      .getMaterialsByContractIdUpdatedListener()
      .subscribe((materials: Material[]) => {
        this.materials = materials;
      });

    this.dataSourceTool = new MatTableDataSource(this.tools);
    this.toolsSub = this.contractsService
      .getToolsByContractIdUpdatedListener()
      .subscribe((tools: Tool[]) => {
        this.tools = tools;
      });

    this.dataSource = new MatTableDataSource(this.materials);
    this.materialSub = this.contractsService
      .getMaterialsByContractIdUpdatedListener()
      .subscribe((materials: Material[]) => {
        this.materials = materials;
      });
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit(): void {
    this.userRole = this.userService.getUserRole();
    this.isAuth = this.userService.getIsAuthenticated();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.contractId = paramMap.get('id')!;
      if (paramMap.has('id')) {
        this.isEditing = true;
        this.contractId = paramMap.get('id')!;
        localStorage.setItem('contractid', this.contractId);
        this.onLogin(this.isAuth, this.contractId);
        this.contractsService
          .getContract(this.contractId)
          .subscribe((contract) => {
            this.contract = {
              id: contract._id,
              title: contract.title,
              business: contract.business,
              process: contract.process,
              numberOfMachines: contract.numberOfMachines,
              line: contract.line,
              date: contract.date,
              asset: contract.asset,
              system: contract.system,
              assetOrCriticComponent: contract.assetOrCriticComponent,
              inventory: contract.inventory,
              systemFunction: contract.systemFunction,
              failtureMode: contract.failtureMode,
              faultureOrigin: contract.faultureOrigin,
              operationalCheckList: contract.operationalCheckList,
              preventivePlans: contract.preventivePlans,
              predictivePlans: contract.predictivePlans,
              category: contract.category,
              workPlace: contract.workPlace,
              frecuency: contract.frecuency,
              lineCondition: contract.lineCondition,
              hm: contract.hm,
              description: contract.description,
            };
          });
      } else {
        this.isEditing = false;
        this.contractId = null!;
      }
    });
  }

  saveContract(form: NgForm) {
    if (form.invalid) {
      console.log('Formulario inválido');
      return;
    }

    if (this.isEditing) {
      this.contractsService.updateContract(form.value, this.contractId);
    } else {
      this.contractsService.createContract(form.value);
    }

    form.resetForm();
  }

  onLogin(authStatus: boolean, contractid: string) {
    this.userRole = this.userService.getUserRole();
    if (authStatus === true) {
      this.contractsService.getMaterialsByContractId(contractid);
      this.contractsSub = this.contractsService
        .getMaterialsByContractIdUpdatedListener()
        .subscribe((materials: Material[]) => {
          this.materials = materials;
          this.dataSourceMaterial = new MatTableDataSource<Material>(
            this.materials
          );
        });
      this.contractsService.getToolsByContractId(contractid);
      this.contractsSub = this.contractsService
        .getToolsByContractIdUpdatedListener()
        .subscribe((tools: Tool[]) => {
          this.tools = tools;
          this.dataSourceTool = new MatTableDataSource<Tool>(this.tools);
        });
    }
  }
  onDelete(id: String) {
    this.contractsService.deleteMaterial(id);
  }

  onDeleteTool(id: string) {
    this.contractsService.deleteTool(id);
  }

  onDeleteContract(id: String) {
    this.contractsService.deleteMaterial(id);
  }

  getErrorMessage() {
    return this.errorMessage;
  }
}
