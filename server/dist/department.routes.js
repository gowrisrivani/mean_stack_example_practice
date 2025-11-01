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
exports.departmentRouter = void 0;
const express = __importStar(require("express"));
const database_1 = require("./database");
const mongodb_1 = require("mongodb");
exports.departmentRouter = express.Router();
exports.departmentRouter.use(express.json());
// ✅ Add a new department
exports.departmentRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const department = req.body;
        // Optional: ensure department has a name
        if (!department.name) {
            res.status(400).send("Department 'name' is required");
            return;
        }
        const result = yield ((_a = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.department) === null || _a === void 0 ? void 0 : _a.insertOne(department));
        if (result === null || result === void 0 ? void 0 : result.acknowledged) {
            res.status(201).send(`Created new department with ID ${result.insertedId}`);
        }
        else {
            res.status(500).send("Failed to create department");
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
}));
// ✅ Get all departments or search by name
exports.departmentRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const query = req.query.q;
        let filter = {};
        if (query) {
            filter = { name: { $regex: query, $options: 'i' } };
        }
        const departments = yield ((_b = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.department) === null || _b === void 0 ? void 0 : _b.find(filter).toArray());
        res.status(200).send(departments);
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
}));
// ✅ Get department by ID
exports.departmentRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    try {
        const id = (_c = req === null || req === void 0 ? void 0 : req.params) === null || _c === void 0 ? void 0 : _c.id;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const department = yield ((_d = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.department) === null || _d === void 0 ? void 0 : _d.findOne(query));
        if (department) {
            res.status(200).send(department);
        }
        else {
            res.status(404).send(`Failed to find a department: ID ${id}`);
        }
    }
    catch (error) {
        res.status(404).send(`Failed to find a department: ID ${(_e = req === null || req === void 0 ? void 0 : req.params) === null || _e === void 0 ? void 0 : _e.id}`);
    }
}));
// ✅ Update department by ID
exports.departmentRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
        const id = (_f = req === null || req === void 0 ? void 0 : req.params) === null || _f === void 0 ? void 0 : _f.id;
        const department = req.body;
        if (!department.name) {
            res.status(400).send("Department 'name' is required");
            return;
        }
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_g = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.department) === null || _g === void 0 ? void 0 : _g.updateOne(query, { $set: department }));
        if (result && result.matchedCount) {
            res.status(200).send(`Updated a department: ID ${id}.`);
        }
        else if (!(result === null || result === void 0 ? void 0 : result.matchedCount)) {
            res.status(404).send(`Failed to find a department: ID ${id}`);
        }
        else {
            res.status(304).send(`Failed to update a department: ID ${id}`);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
}));
// ✅ Delete department by ID with check for employees
exports.departmentRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k;
    try {
        const id = (_h = req === null || req === void 0 ? void 0 : req.params) === null || _h === void 0 ? void 0 : _h.id;
        const departmentId = new mongodb_1.ObjectId(id);
        // Prevent deleting if employees exist in this department
        const employeesInDept = yield ((_j = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _j === void 0 ? void 0 : _j.findOne({ departmentId }));
        if (employeesInDept) {
            res.status(400).send("Cannot delete department with employees assigned");
            return;
        }
        const result = yield ((_k = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.department) === null || _k === void 0 ? void 0 : _k.deleteOne({ _id: departmentId }));
        if (result && result.deletedCount) {
            res.status(202).send(`Removed a department: ID ${id}`);
        }
        else {
            res.status(404).send(`Failed to find a department: ID ${id}`);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
}));
