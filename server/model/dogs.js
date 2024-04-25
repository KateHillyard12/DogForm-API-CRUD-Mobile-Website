const connection = require('./connection.js');

async function get(id) {
  const getSql = 'SELECT * FROM dog_breeds WHERE id = ?';
  let queryParams = [id];

  console.log(getSql);
  console.log(queryParams);

  return await connection.query(insertSql, queryParams);

}

async function getAll(parameters = {}) {
  let selectSql = `SELECT 
     dog_breeds.id AS dogId,
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


  //Filtering based on form inputs
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

  console.log(selectSql);
  return await connection.query(insertSql, queryParams);
}



async function insert(parameters = {}) {

  let insertSql = 'INSERT INTO dog_breeds (name, breed, fur, color, energy, size) VALUES (?, ?, ?, ?, ?, ?) ';
  let queryParams = [];

  if (typeof parameters.name !== 'undefined') {
    queryParameters.push(parameters.name);
  }
  if (typeof parameters.breed !== 'undefined') {
    queryParameters.push(parameters.breed);
  }
  if (typeof parameters.fur !== 'undefined') {
    queryParameters.push(parameters.fur);
  }
  if (typeof parameters.color !== 'undefined') {
    queryParameters.push(parameters.color);
  }
  if (typeof parameters.energy !== 'undefined') {
    queryParameters.push(parameters.energy);
  }
  if (typeof parameters.size !== 'undefined') {
    queryParameters.push(parameters.size);
  }

  return await connection.query(insertSql, queryParams);
}



async function edit(parameters = {}) {
  let updateSql = 'UPDATE dog_breeds SET name = ?, breed = ?, fur = ?, color = ?, energy = ?, size = ?  WHERE  id = ?';
  let queryParams = [];

  if (typeof parameters.name !== 'undefined') {
    queryParameters.push(parameters.name);
  }
  if (typeof parameters.breed !== 'undefined') {
    queryParameters.push(parameters.breed);
  }
  if (typeof parameters.fur !== 'undefined') {
    queryParameters.push(parameters.fur);
  }
  if (typeof parameters.color !== 'undefined') {
    queryParameters.push(parameters.color);
  }
  if (typeof parameters.energy !== 'undefined') {
    queryParameters.push(parameters.energy);
  }
  if (typeof parameters.size !== 'undefined') {
    queryParameters.push(parameters.size);
  }

  queryParams.push(parameters.dogId);

  console.log(queryParams);
  console.log(updateSql);

  return await connection.query(updateSqlSql, queryParams);

}


async function deleteById(id) {

  const deleteSql = `DELETE FROM dog_breeds WHERE id =?`
  let queryParams = [id];

  console.log(deleteSql);
  console.log(queryParams);

  return await connection.query(deleteSql, queryParams);


}

module.exports = {
  get,
  getAll,
  insert,
  edit,
  deleteById
}