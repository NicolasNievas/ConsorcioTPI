import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from '../service/rest.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EmployeeType, DocumentType } from '../models/enums';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
  providers: [RestService]
})
export class CreateEmployeeComponent {
  documentTypes = Object.values(DocumentType);
  employeeTypes = Object.values(EmployeeType);
  employeeForm: FormGroup;

  private restService = inject(RestService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      documentType: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      employeeType: ['', Validators.required],
      hiringDate: ['', Validators.required],
      birthDate: ['', Validators.required],
      active: [true]
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.restService.addEmployee(this.employeeForm.value).subscribe({
        next: () => {
          Swal.fire('Empleado Creado', 'El empleado ha sido creado exitosamente.', 'success');
          this.router.navigate(['/employee/list']); 
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          Swal.fire('Error', 'No se pudo crear el empleado', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Por favor, complete todos los campos requeridos correctamente', 'error');
    }
  }

  onCancel(): void {
    this.router.navigate(['/employee/list']);
  }
}
