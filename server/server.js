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

//character GET
app.get("/character", async (_, response) => {
  const result = await db.query(`SELECT * FROM character ORDER BY id`);

  const character = result.rows;

  response.send(character);
});

//character POST
app.post("/character", async (request, response) => {
  //request body
  const { name, candies, health, costume } = request.body;

  //query to database
  const insertData = await db.query(
    `INSERT INTO character (name, candies, health, costume) VALUES ($1, $2, $3, $4)`,
    [name, candies, health, costume]
  );

  response.json(insertData);
});

//character PUT
app.put("/character", async (request, response) => {
  const { id, candies, health } = request.body;
  const update = await db.query(
    `UPDATE character SET candies = ${candies}, health = ${health} WHERE id = ${id} `
  );
  response.send(update);
});

//Story GET
app.get("/story", async (_, response) => {
  const result = await db.query(`SELECT * FROM story ORDER BY id`);

  const story = result.rows;

  response.send(story);
});

//Choices GET
app.get("/choices", async (_, response) => {
  const result = await db.query(`SELECT * FROM choices JOIN story on story.id = choices.story_id ORDER BY choices.id`);

  const choices = result.rows;

  response.send(choices);
});

//Enemy GET
app.get("/enemy", async (_, response) => {
  const result = await db.query(`SELECT * FROM enemy ORDER BY id`);

  const enemy = result.rows;

  response.send(enemy);
});

//port
app.listen("8080", () => {
  console.log("Server running on port 8080");
});
