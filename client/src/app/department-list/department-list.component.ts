import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../department.service';

import { Department } from '../department';

@Component({
  selector: 'app-departments-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  styles: [
    `
      table {
        width: 100%;
      }

      mat-form-field {
        width: 100%;
        margin-bottom: 1rem;
      }

      button:first-of-type {
        margin-right: 1rem;
      }
    `,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Departments List</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>Search by Department Name</mat-label>
          <input
            matInput
            [(ngModel)]="searchQuery"
            (input)="onSearchInput($event)"
            placeholder="Enter department name"
          />
        </mat-form-field>

        <table mat-table [dataSource]="departmentService.departments$()">
          <!-- ID Column -->
          <ng-container matColumnDef="col-id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let element">{{ element._id }}</td>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="col-name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let element">{{ element.name }}</td>
          </ng-container>

          <!-- Action Column -->
          <ng-container matColumnDef="col-action">
            <th mat-header-cell *matHeaderCellDef>Action</th>
            <td mat-cell *matCellDef="let element">
              <button mat-raised-button [routerLink]="['edit', element._id]">
                Edit
              </button>
              <button
                mat-raised-button
                color="warn"
                (click)="deleteDepartment(element._id || '')"
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
          Add a New Department
        </button>
        <button mat-raised-button color="accent" [routerLink]="['/']">
          Employees
        </button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class DepartmentListComponent implements OnInit {
  searchQuery = signal('');

  displayedColumns: string[] = ['col-id', 'col-name', 'col-action'];

  constructor(public departmentService: DepartmentService) {}

  ngOnInit() {
    this.fetchDepartments();
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const query = target.value.trim();

    if (query) {
      this.departmentService.searchDepartments(query);
    } else {
      this.fetchDepartments();
    }
  }

  deleteDepartment(id: string): void {
    this.departmentService.deleteDepartment(id).subscribe({
      next: () => this.fetchDepartments(),
      error: (error: any) => {
        alert('Failed to delete department: ' + (error.error || error.message));
        console.error(error);
      },
    });
  }

  private fetchDepartments(): void {
    this.departmentService.getDepartments();
  }
}

