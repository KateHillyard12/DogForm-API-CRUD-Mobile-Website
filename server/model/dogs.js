const connection = require("./connection");

async function get(id) {}
async function getAll(parameters = {}) {}
async function insert(parameters = {}) {
  const insertSql = `INSERT INTO dog_breeds (name, breed, fur, color, energy, size) 
        VALUES (?, ?, ?, ?, ?, ?)`;
  let queryParams = [
    parameters.name,
    parameters.breed,
    parameters.fur,
    parameters.color,
    parameters.energy,
    parseInt(parameters.size),
  ];
}

return await connection.query(insertSql, queryParams);

async function edit(parameters = {}) {}
async function deleteById(id) {}

module.exports = {
  get,
  getAll,
  insert,
  edit,
  deleteById,
};
