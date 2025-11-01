import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { Employee } from '../employee';
import { Department } from '../department';
import { EmployeeService } from '../employee.service';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, FormsModule],
  styles: [
    `
      table {
        width: 100%;

        button:first-of-type {
          margin-right: 1rem;
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Employees List</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>Search by Empid or Name</mat-label>
          <input matInput [(ngModel)]="searchQuery" (input)="onSearchInput($event)" placeholder="Enter empid or name">
        </mat-form-field>
        <table mat-table [dataSource]="employeesService.employees$()">
          <ng-container matColumnDef="col-empid">
            <th mat-header-cell *matHeaderCellDef>Empid</th>
            <td mat-cell *matCellDef="let element">{{ element.empid }}</td>
          </ng-container>
          <ng-container matColumnDef="col-name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let element">{{ element.name }}</td>
          </ng-container>
          <ng-container matColumnDef="col-position">
            <th mat-header-cell *matHeaderCellDef>Position</th>
            <td mat-cell *matCellDef="let element">{{ element.position }}</td>
          </ng-container>
          <ng-container matColumnDef="col-level">
            <th mat-header-cell *matHeaderCellDef>Level</th>
            <td mat-cell *matCellDef="let element">{{ element.level }}</td>
          </ng-container>
          <ng-container matColumnDef="col-department">
            <th mat-header-cell *matHeaderCellDef>Department</th>
            <td mat-cell *matCellDef="let element">{{ getDepartmentName(element.departmentId) }}</td>
          </ng-container>
          <ng-container matColumnDef="col-action">
            <th mat-header-cell *matHeaderCellDef>Action</th>
            <td mat-cell *matCellDef="let element">
              <button mat-raised-button [routerLink]="['edit/', element._id]">
                Edit
              </button>
              <button
                mat-raised-button
                color="warn"
                (click)="deleteEmployee(element._id || '')"
              >
                Delete
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" [routerLink]="['new']">
          Add a New Employee
        </button>
        <button mat-raised-button color="accent" [routerLink]="['department']">
          Departments
        </button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class EmployeesListComponent implements OnInit {
  searchQuery = signal('');

  displayedColumns: string[] = [
    'col-empid',
    'col-name',
    'col-position',
    'col-level',
    'col-department',
    'col-action',
  ];

  constructor(public employeesService: EmployeeService) {}

  ngOnInit() {
    this.fetchEmployees();
    this.employeesService.getDepartments();
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target.value.trim();
    if (query) {
      this.employeesService.searchEmployees(query);
    } else {
      this.fetchEmployees();
    }
  }

  deleteEmployee(id: string): void {
    this.employeesService.deleteEmployee(id).subscribe({
      next: () => this.fetchEmployees(),
    });
  }

  getDepartmentName(departmentId: string): string {
    const departments = this.employeesService.departments$();
    const department = departments.find(d => d._id === departmentId);
    return department ? department.name : 'Unknown';
  }

  private fetchEmployees(): void {
    this.employeesService.getEmployees();
  }
}
