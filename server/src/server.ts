import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
import { employeeRouter } from "./employee.routes";
import { departmentRouter } from "./department.routes";

// Load environment variables from the .env file, where the MONGO_URI is configured
dotenv.config();

const { MONGO_URI } = process.env;

const uri = MONGO_URI || 'mongodb://localhost:27017';

connectToDatabase(uri)
  .then(() => {
    const app = express();

    // Debug middleware to log requests
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });

    app.use(cors());
    app.use(express.json());
    app.use("/employees", employeeRouter);
    app.use("/departments", departmentRouter);

    // start the Express server
    app.listen(5200, () => {
      console.log(`Server running at http://localhost:5200...`);
    });
  })
  .catch((error) => console.error(error));

