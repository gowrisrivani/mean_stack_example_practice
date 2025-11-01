import { Routes } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import {DepartmentListComponent} from './department-list/department-list.component';
import { AddDepartmentComponent } from './add-department/add-department.component';
import { EditDepartmentComponent } from './edit-department/edit-department.component';

export const routes: Routes = [
  { path: '', component: EmployeesListComponent, title: 'Employees List' },
  { path: 'new', component: AddEmployeeComponent },
  { path: 'edit/:id', component: EditEmployeeComponent },
  {path: 'department',component: DepartmentListComponent, title: 'Department List'},
  { path: 'department/new', component: AddDepartmentComponent, title: 'Add Department' },
  { path: 'department/edit/:id', component: EditDepartmentComponent, title: 'Edit Department' },
];
