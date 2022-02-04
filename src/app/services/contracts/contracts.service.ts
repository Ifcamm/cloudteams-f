import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Contract } from 'src/app/models/contract.model';
import { Material } from 'src/app/models/material.model';
import { Tool } from 'src/app/models/tool.model';

const url = environment.apiUrl + '/contracts';
// const url = 'http://localhost:3000/api/' + 'contracts';

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  contracts: Contract[] = [];
  contractsUpdated = new Subject<Contract[]>();

  contractById: Contract[] = [];
  contractByIdUpdated = new Subject<Contract[]>();

  materialsByContractId: Material[] = [];
  materialsByContractIdUpdated = new Subject<Material[]>();

  toolsByContractId: Tool[] = [];
  toolsByContractIdUpdated = new Subject<Tool[]>();

  private contractId = '';

  constructor(private router: Router, private http: HttpClient) {}

  //GET
  getContracts() {
    this.http
      .get<any>(`${url}`)
      .pipe(
        map((contractsData) => {
          return contractsData.map(
            (contract: {
              _id: String;
              title: String;
              business: String;
              process: String;
              numberOfMachines: String;
              line: String;
              date: String;
              asset: String;
              system: String;
              assetOrCriticComponent: String;
              inventory: String;
              systemFunction: String;
              failtureMode: String;
              faultureOrigin: String;
              operationalCheckList: String;
              preventivePlans: String;
              predictivePlans: String;
              category: String;
              workPlace: String;
              frecuency: String;
              lineCondition: String;
              hm: String;
              description: String;
            }) => {
              return {
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
            }
          );
        })
      )
      .subscribe((response) => {
        this.contracts = response;
        this.contractsUpdated.next([...this.contracts]);
      });
  }

  //aquilaprueba del type contract
  getContract(id: string) {
    return this.http.get<{
      _id: String;
      title: String;
      business: String;
      process: String;
      numberOfMachines: String;
      line: String;
      date: String;
      asset: String;
      system: String;
      assetOrCriticComponent: String;
      inventory: String;
      systemFunction: String;
      failtureMode: String;
      faultureOrigin: String;
      operationalCheckList: String;
      preventivePlans: String;
      predictivePlans: String;
      category: String;
      workPlace: String;
      frecuency: String;
      lineCondition: String;
      hm: String;
      description: String;
    }>(`${url}/${id}`);
  }

  getMaterial(materialid: string) {
    return this.http.get<{
      _id: String;
      contractId: String;
      sapCode: String;
      sparePart: String;
      units: String;
    }>(`${url}/materials/edit/${materialid}`);
  }
  getTool(toolid: string) {
    return this.http.get<{
      _id: String;
      contractId: String;
      tool: String;
    }>(`${url}/tools/edit/${toolid}`);
  }

  getMaterialsByContractId(contractid: string) {
    this.http
      .get<any>(`${url}/materials/${contractid}`)
      .pipe(
        map((response) => {
          return response.map(
            (material: {
              _id: String;
              contractId: String;
              sapCode: String;
              sparePart: String;
              units: String;
            }) => {
              return {
                id: material._id,
                contractId: material.contractId,
                sapCode: material.sapCode,
                sparePart: material.sparePart,
                units: material.units,
              };
            }
          );
        })
      )
      .subscribe((response) => {
        this.materialsByContractId = response;
        this.materialsByContractIdUpdated.next(
          [...this.materialsByContractId].reverse()
        );
      });
  }

  getToolsByContractId(id: string) {
    this.http
      .get<any>(`${url}/tools/${id}`)
      .pipe(
        map((response) => {
          return response.map(
            (tool: { _id: String; contractId: String; tool: String }) => {
              return {
                id: tool._id,
                contractId: tool.contractId,
                tool: tool.tool,
              };
            }
          );
        })
      )
      .subscribe((response) => {
        this.toolsByContractId = response;
        this.toolsByContractIdUpdated.next(
          [...this.toolsByContractId].reverse()
        );
      });
  }

  //POST
  createContract(contract: Contract) {
    this.http.post(`${url}/newcontract`, contract).subscribe((response) => {
      if (response) {
        this.router.navigate([`/contracts`]);
      } else {
        console.log('No se pudo crear el contrato');
      }
    });
  }

  createMaterial(material: Material) {
    this.http.post(`${url}/newmaterial`, material).subscribe((response) => {
      if (response) {
        this.router.navigate([`/contracts`]);
      } else {
        console.log('No se pudo crear el material');
      }
    });
  }

  createTool(tool: Tool) {
    this.http.post(`${url}/addtool`, tool).subscribe((response) => {
      if (response) {
        this.router.navigate([`/contracts`]);
      } else {
        console.log('No se pudo crear la herramienta');
      }
    });
  }

  //UPDATE

  updateContract(contract: Contract, id: String) {
    this.http.put(`${url}/${id}`, contract).subscribe((response) => {
      const newContract = [...this.contracts];
      const oldContractIndex = newContract.findIndex(
        (contract) => contract.id === id
      );
      newContract[oldContractIndex] = contract;
      this.contractsUpdated.next([...this.contracts]);
      this.router.navigate([`/contracts`]);
    });
  }

  updateMaterial(material: Material, id: String) {
    this.http.put(`${url}/material/${id}`, material).subscribe((response) => {
      const newMaterialsByContractId = [...this.materialsByContractId];
      const oldMaterialsByContractIdIndex = newMaterialsByContractId.findIndex(
        (material) => material.id === id
      );
      newMaterialsByContractId[oldMaterialsByContractIdIndex] = material;
      this.materialsByContractIdUpdated.next([...this.materialsByContractId]);
    });
  }

  updateTool(tool: Tool, id: String) {
    this.http.put(`${url}/tool/${id}`, tool).subscribe((response) => {
      const newToolByContractId = [...this.toolsByContractId];
      const oldMaterialsByContractIdIndex = newToolByContractId.findIndex(
        (tool) => tool.id === id
      );
      newToolByContractId[oldMaterialsByContractIdIndex] = tool;
      this.toolsByContractIdUpdated.next([...this.toolsByContractId]);
      this.router.navigate([`/contracts`]);
    });
  }

  //DELETE
  deleteContract(id: string) {
    this.http.delete(`${url}/${id}`).subscribe((response) => {
      const contractsFiltered = this.contracts.filter(
        (contracts) => contracts.id != id
      );
      this.contracts = contractsFiltered;
      this.contractsUpdated.next([...this.contracts]);
      // this.router
      //   .navigate([`/maintenances/${this.machineAssetcode}`])
      //   .then(() => {
      //     window.location.reload();
      //   });
    });
  }

  deleteMaterial(id: String) {
    this.http.delete(`${url}/material/${id}`).subscribe((response) => {
      const materialFiltered = this.materialsByContractId.filter(
        (contracts) => contracts.id != id
      );
      this.materialsByContractId = materialFiltered;
      this.materialsByContractIdUpdated.next([...this.materialsByContractId]);
      // this.router
      //   .navigate([`/maintenances/${this.machineAssetcode}`])
      //   .then(() => {
      //     window.location.reload();
      //   });
    });
  }

  deleteTool(id: string) {
    this.http.delete(`${url}/tool/${id}`).subscribe((response) => {
      const toolsFiltered = this.toolsByContractId.filter(
        (contracts) => contracts.id != id
      );
      this.toolsByContractId = toolsFiltered;
      this.toolsByContractIdUpdated.next([...this.toolsByContractId]);
      // this.router
      //   .navigate([`/maintenances/${this.machineAssetcode}`])
      //   .then(() => {
      //     window.location.reload();
      //   });
    });
  }
  getContractsByIdUpdatedListener() {
    return this.contractByIdUpdated.asObservable();
  }
  getContractsUpdatedListener() {
    return this.contractsUpdated.asObservable();
  }
  getMaterialsByContractIdUpdatedListener() {
    return this.materialsByContractIdUpdated.asObservable();
  }
  getToolsByContractIdUpdatedListener() {
    return this.toolsByContractIdUpdated.asObservable();
  }
  setContractId(contractid: string) {
    localStorage.setItem('contractid', contractid);
  }
  getContractId() {
    const machineAssetcode = localStorage.getItem('contractid');
    return this.contractId;
  }
}
