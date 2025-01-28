const express = require("express");
const { Pool } = require("pg");
const app = express();

app.use(express.json()); //added because I couldn't figure something out in terminal

const pool = new Pool({
  //added because I couldn't figure something out in terminal
  user: "alyssajones",
  host: "localhost",
  database: "acme_icecream",
  password: "",
  port: 5432,
});

pool
  .connect()
  .then((client) => {
    console.log("Connected to the database successfully");
    client.release(); // release the client after testing the connection
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

app.get("/api/flavors", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM flavors");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching flavors:", error);
    res.status(500).json({ error: "Error fetching flavors" });
  }
});

app.get("/api/flavors/favorites", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM flavors WHERE is_favorite = true"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching favorite flavors:", error);
    res.status(500).json({ error: "Error fetching favorite flavors" });
  }
});

app.post("/api/flavors", async (req, res) => {
  const { name, is_favorite } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO flavors (name, is_favorite) VALUES ($1, $2) RETURNING *",
      [name, is_favorite]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding flavor:", error);
    res.status(500).json({ error: "Error adding flavor" });
  }
});

app.patch("/api/flavors/:id/favorite", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE flavors SET is_favorite = true WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Flavor not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating flavor:", error);
    res.status(500).json({ error: "Error updating flavor" });
  }
});

app.delete("/api/flavors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM flavors WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Flavor not found" });
    }
    res.status(200).json({ message: "Flavor deleted successfully" });
  } catch (error) {
    console.error("Error deleting flavor:", error);
    res.status(500).json({ error: "Error deleting flavor" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
