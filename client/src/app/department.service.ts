import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Department } from './department';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  // ⚙️ Adjust this to match your backend API endpoint
  private apiUrl = '/departments';

  // Signal to hold department data
  private _departments = signal<Department[]>([]);
  departments$ = this._departments.asReadonly();

  constructor(private http: HttpClient) {}

  /** ✅ Fetch all departments */
  getDepartments(): void {
    this.http.get<Department[]>(this.apiUrl).subscribe({
      next: (data) => this._departments.set(data),
      error: (err) => console.error('Failed to fetch departments', err),
    });
  }

  /** ✅ Search departments by name (case-insensitive) */
  searchDepartments(query: string): void {
    // optional: if your backend supports query params like ?q=search
    this.http.get<Department[]>(`${this.apiUrl}?q=${query}`).subscribe({
      next: (data) => this._departments.set(data),
      error: (err) => console.error('Failed to search departments', err),
    });
  }

  /** ✅ Delete a department by ID */
  deleteDepartment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /** ✅ Create a new department */
  addDepartment(dept: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, dept);
  }

  /** ✅ Update a department */
  updateDepartment(id: string, dept: Partial<Department>): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, dept);
  }

  /** ✅ Get a single department by ID */
  getDepartment(id: string): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }
}
