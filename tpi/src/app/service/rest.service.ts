import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/data.interfaces';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private apiUrl = 'http://localhost:3000/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee)
  }  

  putEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${employee.id}`, employee);
  }

  deleteEmployee(id: number): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${id}`, { active: false });
  }

  activateEmployee(id: number): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${id}`, { active: true });
  }

  searchEmployees(documentType: string, documentNumber: string): Observable<Employee[]> {
    let params = new HttpParams();
    if (documentType) {
      params = params.append('documentType', documentType);
    }
    if (documentNumber) {
      params = params.append('documentNumber', documentNumber);
    }
    return this.http.get<Employee[]>(this.apiUrl, { params });
  }
}
