const mysql = require("mysql")

var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "backend",
    charset : "utf8mb4"
})
connection.connect(function(err,res){
    if(err){
        console.log("Database error",err)
    }else {
        console.log("db is connected")
    }
})

module.exports = connection
