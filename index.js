const express = require("express");
const { default: inquirer } = require("inquirer");
// Import and require mysql2
const mysql = require("mysql2");

const connection = require("./db/connection.js");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

//inquirer("/api/movies", (req, res) => {
const sql = `SELECT id, movie_name AS title FROM movies`;

connection.query(sql, (err, rows) => {
  if (err) {
    res.status(500).json({ error: err.message });
    return;
  }
  res.json({
    message: "success",
    data: rows,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
