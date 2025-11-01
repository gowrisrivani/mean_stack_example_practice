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
const dotenv = __importStar(require("dotenv"));
const database_1 = require("./database");
dotenv.config();
const { ATLAS_URI } = process.env;
if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}
const departments = [
    { name: "frontend" },
    { name: "backend" },
    { name: "database" },
    { name: "deployment" },
    { name: "consultants" }
];
function seed() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, database_1.connectToDatabase)(ATLAS_URI);
        for (const dep of departments) {
            const existing = yield ((_a = database_1.collections.department) === null || _a === void 0 ? void 0 : _a.findOne({ name: dep.name }));
            if (!existing) {
                yield ((_b = database_1.collections.department) === null || _b === void 0 ? void 0 : _b.insertOne(dep));
                console.log(`Inserted department: ${dep.name}`);
            }
            else {
                console.log(`Department ${dep.name} already exists`);
            }
        }
        console.log("Seeding completed.");
        process.exit(0);
    });
}
seed().catch(console.error);
