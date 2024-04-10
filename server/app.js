// Libraries
const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");

// Setup defaults for script
const app = express();
const upload = multer();
const port = 80; // Default port to HTTP server
const connection = mysql.createConnection({
  //http://54.190.23.106/phpMyAdmin/index.php?route=/
  host: "student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com",
  user: "KATEHILLYARD",
  password: "nJ1OhMdOUPZw4qyZsUe5GweqeJIlVqYtAlq",
  database: "KATEHILLYARD",
});

// The * in app.* needs to match the method type of the request
app.post("/", upload.none(), (request, response) => {
  // SELECT statement variables
  let selectSql = `SELECT 
  dog_breeds.name, 
  dog_breeds.breed, 
  dog_breeds.fur, 
  dog_breeds.color, 
  dog_breeds.energy, 
  dog_breeds.size,
  dog_stats.shedding_level,
  dog_stats.dog_kindness,
  dog_stats.child_kindness,
  dog_stats.drool_level,
  dog_stats.bark_level,
  dog_stats.train_level
FROM dog_breeds
INNER JOIN dog_stats ON dog_breeds.id = dog_stats.id`;

  let whereStatements = [];
  let queryParams = [];
  let orderByStatements = [];

  // Filtering based on form inputs
  console.log(request.body);

  if (
    typeof request.body.breed !== "undefined" &&
    request.body.breed !== "none"
  ) {
    whereStatements.push(`breed = ?`);
    queryParams.push(request.body.breed);
  }
  if (typeof request.body.fur !== "undefined" && request.body.fur !== "none") {
    whereStatements.push(`fur = ?`);
    queryParams.push(request.body.fur);
  }
  if (
    typeof request.body.color !== "undefined" &&
    request.body.color.length > 0
  ) {
    whereStatements.push(`color LIKE ?`);
    queryParams.push("%" + request.body.color + "%");
  }
  if (
    typeof request.body.energy !== "undefined" &&
    request.body.energy !== "none"
  ) {
    whereStatements.push(`energy = ?`);
    queryParams.push(request.body.energy);
  }
  if (
    typeof request.body.size !== "undefined" &&
    request.body.size.length > 0
  ) {
    whereStatements.push(`size = ?`);
    queryParams.push(request.body.size);
  }

  // Dynamically add WHERE expressions to SELECT statements if needed
  if (whereStatements.length > 0) {
    selectSql += " WHERE " + whereStatements.join(" AND ");
  }

  //Dynamically add ORDER BY expressions to SELECT statements if needed
  if (orderByStatements.length > 0) {
    selectSql = selectSql + " ORDER BY " + orderByStatements.join(", ");
  }

  if (
    typeof request.body.limit !== "undefined" &&
    request.body.limit > 0 &&
    request.body.limit <= 100 // Ensure limit is within a reasonable range
  ) {
    selectSql += " LIMIT ?";
    queryParams.push(parseInt(request.body.limit)); // Push the limit value to queryParams
  }

  connection.query(selectSql, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      return response
        .status(500) // Error code when something goes wrong with the server
        .setHeader("Access-Control-Allow-Origin", "*") // Prevent CORS error
        .json({ message: "Something went wrong with the server." });
    } else {
      // Default response object
      response
        .setHeader("Access-Control-Allow-Origin", "*") // Prevent CORS error
        .json({ data: result });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
