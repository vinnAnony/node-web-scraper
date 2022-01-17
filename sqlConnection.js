
// Importing MySQL module
const mysql = require("mysql");

// Creating connection
let db_con = mysql.createConnection({
    host: "192.168.56.56",
    port: 3306,
    user: "homestead",
    password: "secret",
    database: "scraper_db"
});

// Connect to MySQL server
db_con.connect((err) => {
    if (err) {
        console.log("Database Connection Failed !!!", err);
    } else {
        console.log("connected to Database");
    }
});

module.exports = db_con;