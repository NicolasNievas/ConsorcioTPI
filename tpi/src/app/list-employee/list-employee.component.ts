import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Employee } from '../models/data.interfaces';
import { RestService } from '../service/rest.service';
import { CommonModule } from '@angular/common';
import { DocumentType } from '../models/enums';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css'],
  providers: [RestService]
})
export class ListEmployeeComponent implements OnInit {
  documentTypes = Object.values(DocumentType);
  employees: Employee[] = [];
  searchForm: FormGroup;

  private restService = inject(RestService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.searchForm = this.fb.group({
      documentType: [''],
      documentNumber: ['']
    });
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this.restService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  searchEmployees(): void {
    const { documentType, documentNumber } = this.searchForm.value;
    this.restService.searchEmployees(documentType, documentNumber).subscribe(employees => {
      this.employees = employees;
    });
  }

  deleteEmployee(employee: Employee): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.restService.deleteEmployee(employee.id).subscribe(
          (updatedEmployee) => {
            Swal.fire('Desactivado', 'El empleado ha sido desactivado.', 'success');
            // Actualizar el empleado en la lista local
            const index = this.employees.findIndex(e => e.id === updatedEmployee.id);
            if (index !== -1) {
              this.employees[index] = updatedEmployee;
            }
          },
          (error) => {
            console.error('Error deactivating employee:', error);
            Swal.fire('Error', 'No se pudo desactivar el empleado', 'error');
          }
        );
      }
    });
  }

  updateEmployee(employee: Employee): void {
    this.router.navigate(['/employee/update', employee.id]);
  }

  createEmployee(): void {
    this.router.navigate(['/employee/create']);
  }
}
