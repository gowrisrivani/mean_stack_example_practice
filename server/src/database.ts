import * as mongodb from "mongodb";
import { Employee } from "./employee";
import { Department } from "./department";

export const collections: {
    department?: mongodb.Collection<Department>;
    employees?: mongodb.Collection<Employee>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("meanStackExample");

    // Apply schema validation for both collections
    await applyDepartmentSchema(db);
    await applyEmployeeSchema(db);

    // Assign collections
    const departmentCollection = db.collection<Department>("department");
    collections.department = departmentCollection;

    const employeesCollection = db.collection<Employee>("employees");
    collections.employees = employeesCollection;

    console.log("Connected to database and collections are ready.");
}

// ---------------------
// Department Schema Validation
// ---------------------
async function applyDepartmentSchema(db: mongodb.Db) {
    const departmentSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string"
                }
            }
        }
    };

    await db.command({
        collMod: "department",
        validator: departmentSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("department", { validator: departmentSchema });
        }
    });
}

// ---------------------
// Employee Schema Validation
// ---------------------
async function applyEmployeeSchema(db: mongodb.Db) {
    const employeeSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["empid", "name", "position", "level", "departmentId"],
            additionalProperties: false,
            properties: {
                _id: {},
                empid: {
                    bsonType: "number",
                    description: "'empid' is required and is a number"
                },
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                position: {
                    bsonType: "string",
                    description: "'position' is required and is a string",
                    minLength: 5
                },
                level: {
                    bsonType: "string",
                    description: "'level' is required and is one of 'junior', 'mid', or 'senior'",
                    enum: ["junior", "mid", "senior"],
                },
                departmentId: {
                    bsonType: "objectId",
                    description: "'departmentId' is required and is an ObjectId"
                },
            },
        },
    };

    await db.command({
        collMod: "employees",
        validator: employeeSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("employees", { validator: employeeSchema });
        }
    });
}
