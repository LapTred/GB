const mysql = require("mysql");

const db = mysql.createConnection({
    host:"us-cluster-east-01.k8s.cleardb.net",
    user:"ba117f89cddcc2",
    password:"8b50e496",
    database:"heroku_a8bf30b9bcd2459",
}); 

module.exports = db;
