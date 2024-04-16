const mysql = require("mysql2/promise");

let connection = null;

async function query(sql, params) {
  //Singleton DB connection
  if (null === connection) {
    console.log("Here");
    connection = await mysql.createConnection({
      //http://54.190.23.106/phpMyAdmin/index.php?route=/
      host: "student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com",
      user: "KATEHILLYARD",
      password: "nJ1OhMdOUPZw4qyZsUe5GweqeJIlVqYtAlq",
      database: "KATEHILLYARD",
    });
  }

  const [results] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query,
};
