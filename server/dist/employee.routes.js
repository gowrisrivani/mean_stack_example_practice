"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRouter = void 0;
const express = __importStar(require("express"));
const mongodb_1 = require("mongodb");
const database_1 = require("./database");
exports.employeeRouter = express.Router();
exports.employeeRouter.use(express.json());
// -------------------------
// Search Employees by empid or name
// -------------------------
exports.employeeRouter.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const queryParam = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.q;
        if (!queryParam) {
            res.status(400).send("Query parameter 'q' is required");
            return;
        }
        const empidQuery = parseInt(queryParam);
        const searchQuery = {
            $or: [
                { empid: empidQuery },
                { name: { $regex: queryParam, $options: 'i' } }
            ]
        };
        const employees = yield ((_b = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _b === void 0 ? void 0 : _b.find(searchQuery).toArray());
        res.status(200).send(employees);
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
}));
// -------------------------
// Get All Employees
// -------------------------
exports.employeeRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const employees = yield ((_c = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _c === void 0 ? void 0 : _c.find({}).toArray());
        res.status(200).send(employees);
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
}));
// -------------------------
// Get Employee by ID
// -------------------------
exports.employeeRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    try {
        const id = (_d = req === null || req === void 0 ? void 0 : req.params) === null || _d === void 0 ? void 0 : _d.id;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const employee = yield ((_e = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _e === void 0 ? void 0 : _e.findOne(query));
        if (employee) {
            res.status(200).send(employee);
        }
        else {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    }
    catch (error) {
        res.status(404).send(`Failed to find an employee: ID ${(_f = req === null || req === void 0 ? void 0 : req.params) === null || _f === void 0 ? void 0 : _f.id}`);
    }
}));
// -------------------------
// Create Employee
// -------------------------
exports.employeeRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j;
    try {
        const employee = req.body;
        // Check if empid already exists
        if (employee.empid) {
            const existingEmployee = yield ((_g = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _g === void 0 ? void 0 : _g.findOne({ empid: employee.empid }));
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
        const departmentId = new mongodb_1.ObjectId(employee.departmentId);
        // Check if department exists
        const departmentExists = yield ((_h = database_1.collections.department) === null || _h === void 0 ? void 0 : _h.findOne({ _id: departmentId }));
        if (!departmentExists) {
            res.status(400).send(`Department with ID ${employee.departmentId} does not exist`);
            return;
        }
        employee.departmentId = departmentId;
        const result = yield ((_j = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _j === void 0 ? void 0 : _j.insertOne(employee));
        if (result === null || result === void 0 ? void 0 : result.acknowledged) {
            res.status(201).send(`Created a new employee: ID ${result.insertedId}.`);
        }
        else {
            res.status(500).send("Failed to create a new employee.");
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
}));
// -------------------------
// Update Employee
// -------------------------
exports.employeeRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k, _l, _m;
    try {
        const id = (_k = req === null || req === void 0 ? void 0 : req.params) === null || _k === void 0 ? void 0 : _k.id;
        const employee = req.body;
        // Convert departmentId to ObjectId if provided
        if (employee.departmentId) {
            const departmentId = new mongodb_1.ObjectId(employee.departmentId);
            const departmentExists = yield ((_l = database_1.collections.department) === null || _l === void 0 ? void 0 : _l.findOne({ _id: departmentId }));
            if (!departmentExists) {
                res.status(400).send(`Department with ID ${employee.departmentId} does not exist`);
                return;
            }
            employee.departmentId = departmentId;
        }
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_m = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _m === void 0 ? void 0 : _m.updateOne(query, { $set: employee }));
        if (result && result.matchedCount) {
            res.status(200).send(`Updated an employee: ID ${id}.`);
        }
        else if (!(result === null || result === void 0 ? void 0 : result.matchedCount)) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
        else {
            res.status(304).send(`Failed to update an employee: ID ${id}`);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
}));
// -------------------------
// Delete Employee
// -------------------------
exports.employeeRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _o, _p;
    try {
        const id = (_o = req === null || req === void 0 ? void 0 : req.params) === null || _o === void 0 ? void 0 : _o.id;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_p = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _p === void 0 ? void 0 : _p.deleteOne(query));
        if (result && result.deletedCount) {
            res.status(202).send(`Removed an employee: ID ${id}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove an employee: ID ${id}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
}));
