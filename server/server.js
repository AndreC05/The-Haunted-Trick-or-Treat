//import modules
import pg from "pg";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

//Server setup
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

//connect to database
const db = new pg.Pool({ connectionString: process.env.DB_CONN_STRING });

//Endpoints
//Root route
app.get("/", (_, response) => {
  response.send("Root route");
});

//port
app.listen("8080", () => {
  console.log("Server running on port 8080");
});
