const connection = require('./connection.js');

async function get(id) {
  const getSql = 'SELECT * FROM dog_breeds WHERE id = ?';
  let queryParams = [id];

  console.log(getSql);
  console.log(queryParams);

  let result = await connection.query(getSql, queryParams);

  return result;

}

async function getAll( parameters = {}) {
  let selectSql = `SELECT 
     db.id AS dogId,
     db.name, 
     db.breed, 
     ft.type,
     db.color, 
     db.energy, 
     db.size
   FROM dog_breeds AS db
   INNER JOIN fur_type AS ft ON db.fur_type_id = ft.id`;

  let whereStatements = [];
  let queryParams = [];
  let orderByStatements = [];


  //Filtering based on form inputs
  console.log(parameters);

  if (
    typeof parameters.breed !== "undefined" &&
    parameters.breed !== "none"
  ) {
    whereStatements.push(`db.breed = ?`);
    queryParams.push(parameters.breed);
  }
  if (typeof parameters.fur !== "undefined" && parameters.fur !== "none") {
    whereStatements.push(`ft.id = ?`);
    queryParams.push(parameters.fur);
  }
  if (
    typeof parameters.color !== "undefined" &&
    parameters.color.length > 0
  ) {
    whereStatements.push(`db.color LIKE ?`);
    queryParams.push("%" + parameters.color + "%");
  }
  if (
    typeof parameters.energy !== "undefined" &&
    parameters.energy !== "none"
  ) {
    whereStatements.push(`db.energy = ?`);
    queryParams.push(parameters.energy);
  }
  if (
    typeof parameters.size !== "undefined" &&
    parameters.size.length > 0
  ) {
    whereStatements.push(`size = ?`);
    queryParams.push(parameters.size);
  }

  // Dynamically add WHERE expressions to SELECT statements if needed
  if (whereStatements.length > 0) {
    selectSql += " WHERE " + whereStatements.join(" AND ");
  }

  //Dynamically add ORDER BY expressions to SELECT statements if needed
  if (orderByStatements.length > 0) {
    selectSql = selectSql + " ORDER BY " + orderByStatements.join(", ");
  }

    //Dynamically add LIMIT expressions to SELECT statements if needed
    if (typeof parameters.limit !== 'undefined' && parameters.limit > 0 && parameters.limit < 100) {
      selectSql = selectSql + ' LIMIT ' + parameters.limit;
  }

  console.log(parameters);
  console.log(queryParams);

  console.log(selectSql);
  return await connection.query(selectSql, queryParams);
}



async function insert(parameters = {}) {

  let insertSql = 'INSERT INTO dog_breeds (name, breed, fur_type_id, color, energy, size) VALUES (?, ?, ?, ?, ?, ?) ';
  let queryParams = [];

  if (typeof parameters.name !== 'undefined') {
    queryParams.push(parameters.name);
  }
  if (typeof parameters.breed !== 'undefined') {
    queryParams.push(parameters.breed);
  }
  if (typeof parameters.fur !== 'undefined') {
    queryParams.push(parameters.fur);
  }
  if (typeof parameters.color !== 'undefined') {
    queryParams.push(parameters.color);
  }
  if (typeof parameters.energy !== 'undefined') {
    queryParams.push(parameters.energy);
  }
  if (typeof parameters.size !== 'undefined') {
    queryParams.push(parameters.size);
  }

  return await connection.query(insertSql, queryParams);
}



async function edit(parameters = {}) {
  let updateSql = 'UPDATE dog_breeds SET name = ?, breed = ?, fur_type_id = ?, color = ?, energy = ?, size = ?  WHERE  id = ?';
  let queryParams = [];

  if (typeof parameters.name !== 'undefined') {
    queryParams.push(parameters.name);
  }
  if (typeof parameters.breed !== 'undefined') {
    queryParams.push(parameters.breed);
  }
  if (typeof parameters.fur !== 'undefined') {
    queryParams.push(parameters.fur);
  }
  if (typeof parameters.color !== 'undefined') {
    queryParams.push(parameters.color);
  }
  if (typeof parameters.energy !== 'undefined') {
    queryParams.push(parameters.energy);
  }
  if (typeof parameters.size !== 'undefined') {
    queryParams.push(parameters.size);
  }

  queryParams.push(parameters.dogId);

  console.log(queryParams);
  console.log(updateSql);

  return await connection.query(updateSql, queryParams);

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