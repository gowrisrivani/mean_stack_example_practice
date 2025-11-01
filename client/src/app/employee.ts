export interface Employee {
  empid : number;
  name: string;
  position: string;
  level: 'junior' | 'mid' | 'senior';
  departmentId: string;
  _id?: string;
}
