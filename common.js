const pg = require("pg");
require("dotenv").config();
const express = require("express");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acmeicecream"
);

client
  .connect() // added this because I was having problems with node seed.js
  .then(() => console.log("Connected to the database successfully"))
  .catch((err) => console.error("Error connecting to the database:", err));

module.exports = { client, express };
