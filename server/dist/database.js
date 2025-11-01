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
exports.connectToDatabase = exports.collections = void 0;
const mongodb = __importStar(require("mongodb"));
exports.collections = {};
function connectToDatabase(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new mongodb.MongoClient(uri);
        yield client.connect();
        const db = client.db("meanStackExample");
        // Apply schema validation for both collections
        yield applyDepartmentSchema(db);
        yield applyEmployeeSchema(db);
        // Assign collections
        const departmentCollection = db.collection("department");
        exports.collections.department = departmentCollection;
        const employeesCollection = db.collection("employees");
        exports.collections.employees = employeesCollection;
        console.log("Connected to database and collections are ready.");
    });
}
exports.connectToDatabase = connectToDatabase;
// ---------------------
// Department Schema Validation
// ---------------------
function applyDepartmentSchema(db) {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield db.command({
            collMod: "department",
            validator: departmentSchema
        }).catch((error) => __awaiter(this, void 0, void 0, function* () {
            if (error.codeName === "NamespaceNotFound") {
                yield db.createCollection("department", { validator: departmentSchema });
            }
        }));
    });
}
// ---------------------
// Employee Schema Validation
// ---------------------
function applyEmployeeSchema(db) {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield db.command({
            collMod: "employees",
            validator: employeeSchema
        }).catch((error) => __awaiter(this, void 0, void 0, function* () {
            if (error.codeName === "NamespaceNotFound") {
                yield db.createCollection("employees", { validator: employeeSchema });
            }
        }));
    });
}
