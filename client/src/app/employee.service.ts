import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from './employee';
import { Department } from './department';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private url = '';
  employees$ = signal<Employee[]>([]);
  employee$ = signal<Employee>({} as Employee);
  departments$ = signal<Department[]>([]);

  constructor(private httpClient: HttpClient) {
    this.getDepartments();
  }

  private refreshEmployees() {
    this.httpClient.get<Employee[]>(`${this.url}/employees`)
      .subscribe(employees => {
        this.employees$.set(employees);
      });
  }

  getEmployees() {
    this.refreshEmployees();
    return this.employees$();
  }

  getEmployee(id: string) {
    this.httpClient.get<Employee>(`${this.url}/employees/${id}`).subscribe(employee => {
      this.employee$.set(employee);
      return this.employee$();
    });
  }

  createEmployee(employee: Employee) {
    return this.httpClient.post(`${this.url}/employees`, employee, { responseType: 'text' });
  }

  updateEmployee(id: string, employee: Employee) {
    return this.httpClient.put(`${this.url}/employees/${id}`, employee, { responseType: 'text' });
  }

  deleteEmployee(id: string) {
    return this.httpClient.delete(`${this.url}/employees/${id}`, { responseType: 'text' });
  }

  searchEmployees(query: string) {
    this.httpClient.get<Employee[]>(`${this.url}/employees/search?q=${query}`)
      .subscribe(employees => {
        this.employees$.set(employees);
      });
    return this.employees$();
  }

  private refreshDepartments() {
    this.httpClient.get<Department[]>(`${this.url}/departments`)
      .subscribe(departments => {
        this.departments$.set(departments);
      });
  }

  getDepartments() {
    this.refreshDepartments();
    return this.departments$();
  }

  getDepartment(id: string) {
    return this.httpClient.get<Department>(`${this.url}/departments/${id}`);
  }

  createDepartment(department: Department) {
    return this.httpClient.post(`${this.url}/departments`, department, { responseType: 'text' });
  }

  updateDepartment(id: string, department: Department) {
    return this.httpClient.put(`${this.url}/departments/${id}`, department, { responseType: 'text' });
  }

  deleteDepartment(id: string) {
    return this.httpClient.delete(`${this.url}/departments/${id}`, { responseType: 'text' });
  }
}
