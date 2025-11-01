import * as mongodb from "mongodb";

export interface Employee {
    empid: number;
    name: string;
    position: string;
    level: "junior" | "mid" | "senior";
    departmentId: mongodb.ObjectId;
    _id?: mongodb.ObjectId;
}
