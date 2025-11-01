import * as express from "express";
import { collections } from "./database";
import { ObjectId } from "mongodb";

export const departmentRouter = express.Router();
departmentRouter.use(express.json());

// ✅ Add a new department
departmentRouter.post("/", async (req, res) => {
  try {
    const department = req.body;

    // Optional: ensure department has a name
    if (!department.name) {
      res.status(400).send("Department 'name' is required");
      return;
    }

    const result = await collections?.department?.insertOne(department);

    if (result?.acknowledged) {
      const insertedDepartment = await collections?.department?.findOne({ _id: result.insertedId });
      res.status(201).send(insertedDepartment);
    } else {
      res.status(500).send("Failed to create department");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error instanceof Error ? error.message : "Unknown error");
  }
});

// ✅ Get all departments or search by name
departmentRouter.get("/", async (req, res) => {
  try {
    const query = req.query.q as string;
    let filter = {};
    if (query) {
      filter = { name: { $regex: query, $options: 'i' } };
    }
    const departments = await collections?.department?.find(filter).toArray();
    res.status(200).send(departments);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : "Unknown error");
  }
});

// ✅ Get department by ID
departmentRouter.get("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const department = await collections?.department?.findOne(query);

    if (department) {
      res.status(200).send(department);
    } else {
      res.status(404).send(`Failed to find a department: ID ${id}`);
    }
  } catch (error) {
    res.status(404).send(`Failed to find a department: ID ${req?.params?.id}`);
  }
});

// ✅ Update department by ID
departmentRouter.put("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const department = req.body;

    if (!department.name) {
      res.status(400).json({ error: "Department 'name' is required" });
      return;
    }

    const query = { _id: new ObjectId(id) };
    const result = await collections?.department?.updateOne(query, { $set: department });

    if (result && result.matchedCount) {
      const updatedDepartment = await collections?.department?.findOne(query);
      res.status(200).json(updatedDepartment);
    } else if (!result?.matchedCount) {
      res.status(404).json({ error: `Failed to find a department: ID ${id}` });
    } else {
      res.status(304).json({ error: `Failed to update a department: ID ${id}` });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(message);
    res.status(400).json({ error: message });
  }
});

// ✅ Delete department by ID with check for employees
departmentRouter.delete("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const departmentId = new ObjectId(id);

    // Prevent deleting if employees exist in this department
    const employeesInDept = await collections?.employees?.findOne({ departmentId });
    if (employeesInDept) {
      res.status(400).json({ error: "Cannot delete department with employees assigned" });
      return;
    }

    const result = await collections?.department?.deleteOne({ _id: departmentId });

    if (result && result.deletedCount) {
      res.status(202).json({ message: `Removed a department: ID ${id}` });
    } else {
      res.status(404).json({ error: `Failed to find a department: ID ${id}` });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(message);
    res.status(400).json({ error: message });
  }
});
