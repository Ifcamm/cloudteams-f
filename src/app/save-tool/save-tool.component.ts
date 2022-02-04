import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Contract } from '../models/contract.model';
import { Material } from '../models/material.model';
import { Tool } from '../models/tool.model';
import { ContractsService } from '../services/contracts/contracts.service';
import { UserService } from '../services/users/user.service';

@Component({
  selector: 'app-save-tool',
  templateUrl: './save-tool.component.html',
  styleUrls: ['./save-tool.component.css'],
})
export class SaveToolComponent implements OnInit {
  private isEditing = false;
  userRole: string = '';
  toolId!: string;
  contractId: string = localStorage.getItem('contractid')!;

  // contractId: string = this.contractsService.get();
  errorMessage = 'Este campo es requerido.';

  tools: Tool = {
    id: '',
    contractId: '',
    tool: '',
  };

  materialsUpdated = new Subject<Material[]>();

  constructor(
    private router: Router,
    public userService: UserService,
    public contractsService: ContractsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userRole = this.userService.getUserRole();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('toolid')) {
        this.isEditing = true;
        this.toolId = paramMap.get('toolid')!;
        this.contractsService.getTool(this.toolId).subscribe((tool) => {
          this.tools = {
            id: tool._id,
            contractId: tool.contractId,
            tool: tool.tool,
          };
          console.log(tool);
        });
      } else {
        this.contractId = paramMap.get('contractid')!;
        this.isEditing = false;
        this.toolId = null!;
      }
    });
  }

  saveMaterial(form: NgForm) {
    if (form.invalid) {
      console.log('Formulario inválido');
      return;
    }

    if (this.isEditing) {
      this.contractsService.updateTool(form.value, this.toolId);
    } else {
      console.log(form.value);
      this.contractsService.createTool(form.value);
    }

    form.resetForm();
    this.router.navigate([`/contracts`, this.contractId]);
  }
  getErrorMessage() {
    return this.errorMessage;
  }
  getMaterialsByContractIdUpdatedListener() {
    return this.materialsUpdated.asObservable();
  }
}
