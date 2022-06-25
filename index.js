// const express = require("express"); // "type" : "commonjs"
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

// console.log(process.env.MONGO_URL);

const app = express();
const PORT = 4001;

const movies = [
  {
    id: "1",
    name: "Vetaikkaran",
    language: "Tamil",
    "Song writer": "Vennelakanthi",
  },
  {
    id: "2",
    name: "Velaiyilla Pattathari",
    language: "Tamil",
    "Song writer": "Dhanush",
  },
  {
    id: "3",
    name: "Master",
    language: "Tamil",
    "Song writer": "Vimal Kashyap",
  },
  {
    id: "4",
    name: "Tenet",
    language: "English",
  },
  {
    id: "5",
    name: "Interstellar",
    language: "English",
  },
  {
    id: "6",
    name: "Bahubali",
    language: "Telugu",
    "Song writer": "Shiva Shakti Datta",
  },
];

//middleware -> intersept -> converting body to json
app.use(express.json());

// const MONGO_URL = "mongodb://localhost";

const MONGO_URL = process.env.MONGO_URL;


async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("mongo is connected");
  return client;
}
const client = await createConnection();

app.get("/", (req, res) => {
  res.send("Hello world");
});

//cursor -> pagination -> convert into array using toArray()

app.get("/movies", async (req, res) => {
  //db.movies.find({});
  const movie = await client
    .db("b30wd")
    .collection("movies")
    .find({})
    .toArray();
  res.send(movie);
});

app.get("/movies/:id", async function (req, res) {
  console.log(req.params);
  const { id } = req.params;
  // const movie = movies.find((mv) => mv.id === id);
  const movie = await client
    .db("b30wd")
    .collection("movies")
    .findOne({ id: id });
  console.log(movie);
  movie
    ? res.send(movie)
    : res.status(404).send({ message: "no such movie  found" });
});


//to delete data
app.delete("/movies/:id", async function (req, res) {
  console.log(req.params);
  //db.movies.deleteOne({"id" : "104"})
  const { id } = req.params;
  // const movie = movies.find((mv) => mv.id === id);
  const result = await client
    .db("b30wd")
    .collection("movies")
    .deleteOne({ id: id });
  res.send(result);
});

app.put("/movies/:id", async function (req, res) {
  console.log(req.params);
  //db.movies.updateOne({"id" : "102"},{$set : updated data})
  const { id } = req.params;
  const updateData = req.body;
  // const movie = movies.find((mv) => mv.id === id);
  const result = await client
    .db("b30wd")
    .collection("movies")
    .updateOne({ id: id },{$set : updateData});
  res.send(result);
});

app.post("/movies", async function (req, res) {
  //db.movies.insertMany(data)
  const data = req.body;
  const result = await client.db("b30wd").collection("movies").insertMany(data);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Server started in ${PORT}`);
});
