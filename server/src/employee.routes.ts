import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const employeeRouter = express.Router();
employeeRouter.use(express.json());

// -------------------------
// Search Employees by empid or name
// -------------------------
employeeRouter.get("/search", async (req, res) => {
    try {
        const queryParam = req?.query?.q as string;
        if (!queryParam) {
            res.status(400).send("Query parameter 'q' is required");
            return;
        }

        const empidQuery = parseInt(queryParam);
        const searchQuery: any = {
            $or: [
                { empid: empidQuery },
                { name: { $regex: queryParam, $options: 'i' } }
            ]
        };

        const employees = await collections?.employees?.find(searchQuery).toArray();
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

// -------------------------
// Get All Employees
// -------------------------
employeeRouter.get("/", async (_req, res) => {
    try {
        const employees = await collections?.employees?.find({}).toArray();
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

// -------------------------
// Get Employee by ID
// -------------------------
employeeRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const employee = await collections?.employees?.findOne(query);

        if (employee) {
            res.status(200).send(employee);
        } else {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find an employee: ID ${req?.params?.id}`);
    }
});

// -------------------------
// Create Employee
// -------------------------
employeeRouter.post("/", async (req, res) => {
    try {
        const employee = req.body;

        // Check if empid already exists
        if (employee.empid) {
            const existingEmployee = await collections?.employees?.findOne({ empid: employee.empid });
            if (existingEmployee) {
                res.status(400).send(`Employee with empid ${employee.empid} already exists`);
                return;
            }
        }

        // Convert departmentId to ObjectId
        if (!employee.departmentId) {
            res.status(400).send("Employee must have a departmentId");
            return;
        }
        const departmentId = new ObjectId(employee.departmentId);

        // Check if department exists
        const departmentExists = await collections.department?.findOne({ _id: departmentId });
        if (!departmentExists) {
            res.status(400).send(`Department with ID ${employee.departmentId} does not exist`);
            return;
        }

        employee.departmentId = departmentId;

        const result = await collections?.employees?.insertOne(employee);
        if (result?.acknowledged) {
            res.status(201).send(`Created a new employee: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new employee.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

// -------------------------
// Update Employee
// -------------------------
employeeRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const employee = req.body;

        // Convert departmentId to ObjectId if provided
        if (employee.departmentId) {
            const departmentId = new ObjectId(employee.departmentId);
            const departmentExists = await collections.department?.findOne({ _id: departmentId });
            if (!departmentExists) {
                res.status(400).send(`Department with ID ${employee.departmentId} does not exist`);
                return;
            }
            employee.departmentId = departmentId;
        }

        const query = { _id: new ObjectId(id) };
        const result = await collections?.employees?.updateOne(query, { $set: employee });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an employee: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an employee: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

// -------------------------
// Delete Employee
// -------------------------
employeeRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections?.employees?.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an employee: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an employee: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});
