const mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'node_app1',
    user: 'root',
    password: ''
});

connection.connect(function(error){
    if (error) {
        throw error;
    } else {
        console.log('Database Connected');
    }
});

module.exports = connection;
