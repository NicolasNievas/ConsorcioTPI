import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeType, DocumentType } from '../models/enums';
import { RestService } from '../service/rest.service';
import { Employee } from '../models/data.interfaces';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css'],
  providers: [RestService]
})
export class UpdateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  documentTypes = Object.values(DocumentType);
  employeeTypes = Object.values(EmployeeType);
  employeeId: number = 0;
  currentEmployee: Employee | null = null;

  private fb = inject(FormBuilder);
  private restService = inject(RestService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      employeeType: ['', Validators.required],
      birthDate: ['', Validators.required],
      hiringDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params['id'];
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this.restService.getEmployeeById(this.employeeId).subscribe(
      (employee: Employee) => {
        this.currentEmployee = employee;
        this.employeeForm.patchValue(employee);
      },
      (error) => {
        console.error('Error fetching employee:', error);
        Swal.fire('Error', 'No se pudo cargar los datos del empleado', 'error');
      }
    );
  }

  onCancel(): void {
    this.router.navigate(['/employee/list']);
  }

  onSubmit(): void {
    if (this.employeeForm.valid && this.currentEmployee) {
      const updatedEmployee = {
        ...this.employeeForm.value,
        id: this.employeeId,
        active: this.currentEmployee.active 
      };
      this.restService.putEmployee(updatedEmployee).subscribe(
        () => {
          Swal.fire('Actualizado', 'El empleado ha sido actualizado.', 'success');
          this.router.navigate(['/employee/list']);
        },
        (error) => {
          console.error('Error updating employee:', error);
          Swal.fire('Error', 'No se pudo actualizar el empleado', 'error');
        }
      );
    }
  }
}