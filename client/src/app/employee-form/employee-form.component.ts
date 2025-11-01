import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../employee';
import { Department } from '../department';
import { DepartmentService } from '../department.service';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
  ],
  styles: `
    .employee-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
    }
    .mat-mdc-radio-button ~ .mat-mdc-radio-button {
      margin-left: 16px;
    }
    .mat-mdc-form-field {
      width: 100%;
    }
  `,
  template: `
    <form
      class="employee-form"
      autocomplete="off"
      [formGroup]="employeeForm"
      (submit)="submitForm()"
    >
      <mat-form-field>
        <mat-label>Empid</mat-label>
        <input matInput placeholder="EmpId" formControlName="empid" required />
        @if (empid?.invalid) {
        <mat-error>Empid must be a number.</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput placeholder="Name" formControlName="name" required />
        @if (name.invalid) {
        <mat-error>Name must be at least 3 characters long.</mat-error>
        }
      </mat-form-field>

      <mat-form-field>
        <mat-label>Position</mat-label>
        <input
          matInput
          placeholder="Position"
          formControlName="position"
          required
        />
        @if (position.invalid) {
        <mat-error>Position must be at least 5 characters long.</mat-error>
        }
      </mat-form-field>

      <mat-radio-group formControlName="level" aria-label="Select an option">
        <mat-radio-button name="level" value="junior" required
          >Junior</mat-radio-button
        >
        <mat-radio-button name="level" value="mid"
          >Mid</mat-radio-button
        >
        <mat-radio-button name="level" value="senior"
          >Senior</mat-radio-button
        >
      </mat-radio-group>

      <mat-form-field>
        <mat-label>Department</mat-label>
        <mat-select formControlName="departmentId" required>
          @for (department of departments(); track department._id) {
            <mat-option [value]="department._id">{{ department.name }}</mat-option>
          }
        </mat-select>
        @if (departmentId.invalid) {
        <mat-error>Department is required.</mat-error>
        }
      </mat-form-field>

      <br />
      <button
        mat-raised-button
        color="primary"
        type="submit"
        [disabled]="employeeForm.invalid"
      >
        Add
      </button>
    </form>
  `,
})
export class EmployeeFormComponent {
  initialState = input<Employee>();

  @Output()
  formValuesChanged = new EventEmitter<Employee>();

  @Output()
  formSubmitted = new EventEmitter<Employee>();

  departments = this.employeeService.departments$;

  employeeForm = this.formBuilder.group({
    empid: [0, [Validators.required, Validators.pattern(/^\d+$/)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    position: ['', [Validators.required, Validators.minLength(5)]],
    level: ['junior', [Validators.required]],
    departmentId: ['', [Validators.required]],
  });

  constructor(private formBuilder: FormBuilder, private departmentService: DepartmentService, private employeeService: EmployeeService) {
    this.departmentService.getDepartments();
    effect(() => {
      if (this.initialState()) {
        this.employeeForm.setValue({
          empid: this.initialState()?.empid || 0,
          name: this.initialState()?.name || '',
          position: this.initialState()?.position || '',
          level: this.initialState()?.level || 'junior',
          departmentId: this.initialState()?.departmentId || '',
        });
      }
    });
  }

  get empid(){
    return this.employeeForm.get('empid')
  }
  get name() {
    return this.employeeForm.get('name')!;
  }
  get position() {
    return this.employeeForm.get('position')!;
  }
  get level() {
    return this.employeeForm.get('level')!;
  }

  get departmentId() {
    return this.employeeForm.get('departmentId')!;
  }

  submitForm() {
    const formValue = this.employeeForm.value;
    formValue.empid = Number(formValue.empid);
    this.formSubmitted.emit(formValue as Employee);
  }
}
