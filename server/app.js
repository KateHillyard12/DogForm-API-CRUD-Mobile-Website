// Libraries
const express = require("express");
const { request } = require("http");
const multer = require("multer");
const mysql = require("mysql2");
const { check, checkSchema, validationResult } = require("express-validator");

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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

app.options("/*", function (req, res, next) {
  res.sendStatus(200);
});

let goodFormValues = [];

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

//Insert Javascript here
app.post(
  "/INSERT",
  upload.none(),
  //name validation
  check("name", "You gotta have a name for your puppo.").isLength({ min: 3 }),
  //breed validation
  check("breed", "Please select a breed for you puppers.").isIn([
    "''", //empty string to prevent default value
    "toy",
    "work",
    "herd",
    "sport",
  ]),
  //fur validation
  check("fur", "Describe your doggos fur.").isIn([
    "''", //empty string to prevent default value
    "smooth",
    "rough",
    "cord",
    "doub",
    "silk",
    "curl",
    "wire",
    "hless",
  ]),
  //color validation
  check("color", "Give your puppy some color!").isLength({ min: 3 }),
  //energy validation
  check("energy", "Tell us how jazzed your fluffers is.").isIn([
    "''", //empty string to prevent default value
    "low",
    "med",
    "high",
  ]),
  //size validation
  check("size", "How big or small is the dawg?").isInt({ min: 1, max: 300 }),

  (request, response) => {
    const insertSql = `INSERT INTO dog_breeds (name, breed, fur, color, energy, size) 
                          VALUES (?, ?, ?, ?, ?, ?)`;
    let queryParams = [
      request.body.name,
      request.body.breed,
      request.body.fur,
      request.body.color,
      request.body.energy,
      parseInt(request.body.size)
    ];

    console.log("Request body:", request.body);


    const errors = validationResult(request);
    goodFormValues.push({ ...request.body });

    connection.query(insertSql, queryParams, (error, result) => {
      if (error) {
        console.log(error);
        return response
          .status(450) //Error code when something goes wrong with the server
          .setHeader("Access-Control-Allow-Origin", "*") //Prevent CORS error

          .json({
            message: "Something went wrong with the server.",
            errors: errors.array(),
          });
      } else {
        //Default response object
        response
          .status(250)
          .setHeader("Access-Control-Allow-Origin", "*") //Prevent CORS error
          .json({
            message: "Form submission was succesful!",
            goodFormValues: goodFormValues,
          });
      }
    });
  }
);

//update

app.post(
  "/UPDATE",
  upload.none(),

  //name validation
  check("name", "You gotta have a name for your puppo.").isLength({ min: 3 }),
  //breed validation
  check("breed", "Please select a breed for you puppers.").isIn([
    "''", //empty string to prevent default value
    "toy",
    "work",
    "herd",
    "sport",
  ]),
  //fur validation
  check("fur", "Describe your doggos fur.").isIn([
    "''", //empty string to prevent default value
    "smooth",
    "rough",
    "cord",
    "doub",
    "silk",
    "curl",
    "wire",
    "hless",
  ]),
  //color validation
  check("color", "Give your puppy some color!").isLength({ min: 3 }),
  //energy validation
  check("energy", "Tell us how jazzed your fluffers is.").isIn([
    "''", //empty string to prevent default value
    "low",
    "med",
    "high",
  ]),
  //size validation
  check("size", "How big or small is the dawg?").isInt({ min: 1, max: 300 }),

  (request, response) => {
    const updateSql =
      "UPDATE dog_breeds name = ?, breed = ?, fur = ?, color = ?, energy = ?, size = ? WHERE id = ?";

    let queryParams = [
      request.body.name,
      request.body.breed,
      request.body.fur,
      request.body.color,
      request.body.energy,
      parseInt(request.body.size),
    ];

    const errors = validationResult(request);
    goodFormValues.push({ ...request.body });

    connection.query(updateSql, queryParams, (error, result) => {
      if (error) {
        console.log(error);
        return response
          .status(450) //Error code when something goes wrong with the server
          .setHeader("Access-Control-Allow-Origin", "*") //Prevent CORS error

          .json({
            message: "Something went wrong with the server.",
            errors: errors.array(),
          });
      } else {
        //Default response object
        response
          .status(250)
          .setHeader("Access-Control-Allow-Origin", "*") //Prevent CORS error
          .json({
            message: "Form submission was succesful!",
            goodFormValues: goodFormValues,
          });
      }
    });
  }
);

//delete
app.put("/DELETE", upload.none(), (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  let data = request.body;

  let deleteSql = `DELETE FROM dog_breeds WHERE id = ?`;
  let values = [data.id];

  connections.query(deleteSql, values, (error, result) => {
    if (error) {
      console.log(error);
      return response
        .status(500)
        .setHeader("Access-Control-Allow-Origin", "*")
        .json({ message: "Something went wrong with the server." });
    } else {
      response
        .setHeader("Access-Control-Allow-Origin", "*")
        .json({ data: result });
    }
  });
});

app.listen(port, () => {
  console.log(`Application app listening at http://localhost:${port}`);
});
