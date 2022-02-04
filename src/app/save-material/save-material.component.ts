import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Contract } from '../models/contract.model';
import { Material } from '../models/material.model';
import { ContractsService } from '../services/contracts/contracts.service';
import { UserService } from '../services/users/user.service';

@Component({
  selector: 'app-save-material',
  templateUrl: './save-material.component.html',
  styleUrls: ['./save-material.component.css'],
})
export class SaveMaterialComponent implements OnInit {
  private isEditing = false;
  userRole: string = '';
  materialId!: string;
  contractId: string = localStorage.getItem('contractid')!;

  // contractId: string = this.contractsService.get();
  errorMessage = 'Este campo es requerido.';

  materials: Material = {
    id: '',
    contractId: '',
    sapCode: '',
    sparePart: '',
    units: '',
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
      if (paramMap.has('materialid')) {
        this.isEditing = true;
        this.materialId = paramMap.get('materialid')!;
        this.contractsService
          .getMaterial(this.materialId)
          .subscribe((material) => {
            this.materials = {
              id: material._id,
              contractId: material.contractId,
              sapCode: material.sapCode,
              sparePart: material.sparePart,
              units: material.units,
            };
            console.log(material);
          });
      } else {
        this.contractId = paramMap.get('contractid')!;
        this.isEditing = false;
        this.materialId = null!;
      }
    });
  }

  saveMaterial(form: NgForm) {
    if (form.invalid) {
      console.log('Formulario inválido');
      return;
    }

    if (this.isEditing) {
      this.contractsService.updateMaterial(form.value, this.materialId);
    } else {
      console.log(form.value);
      this.contractsService.createMaterial(form.value);
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
