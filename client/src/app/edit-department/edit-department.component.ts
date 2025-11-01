import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DepartmentService } from '../department.service';
import { Department } from '../department';

@Component({
  selector: 'app-edit-department',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Edit Department</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form
          class="department-form"
          autocomplete="off"
          [formGroup]="departmentForm"
          (submit)="submitForm()"
        >
          <mat-form-field>
            <mat-label>Name</mat-label>
            <input matInput placeholder="Department Name" formControlName="name" required />
            @if (name.invalid) {
            <mat-error>Name must be at least 3 characters long.</mat-error>
            }
          </mat-form-field>

          <br />
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="departmentForm.invalid"
          >
            Update Department
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .department-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
    }
    .mat-mdc-form-field {
      width: 100%;
    }
  `,
})
export class EditDepartmentComponent implements OnInit {
  departmentForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  private departmentId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.params['id'];
    this.loadDepartment();
  }

  get name() {
    return this.departmentForm.get('name')!;
  }

  loadDepartment(): void {
    this.departmentService.getDepartment(this.departmentId).subscribe({
      next: (department: Department) => {
        this.departmentForm.patchValue({
          name: department.name,
        });
      },
      error: (error: any) => {
        alert('Failed to load department');
        console.error(error);
        this.router.navigate(['/department']);
      },
    });
  }

  submitForm() {
    const formValue = this.departmentForm.value;
    const department: Partial<Department> = {
      name: formValue.name || '',
    };
    this.departmentService.updateDepartment(this.departmentId, department).subscribe({
      next: () => {
        this.router.navigate(['/department']);
        // Refresh departments to update dropdowns
        this.departmentService.getDepartments();
      },
      error: (error) => {
        alert('Failed to update department');
        console.error(error);
      },
    });
  }
}
