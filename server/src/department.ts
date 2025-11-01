import * as mongodb from "mongodb";

export interface Department {
    name: string;
    description?: string;
    _id?: mongodb.ObjectId;
}
