const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root2",
    password:"C0MUN25xz!",
    database:"Veterinaria",
}); 

module.exports = db;