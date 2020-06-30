const mysql = require('mysql'); 

class Conexion {

    connect(callback) {
        var con = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'easyfixone'
        });
        
        con.connect(function(err){
            if (err) {
                console.log(err);
                return;
            } else {
                console.log('Conectado a easyfix');
            }
        });

        callback(con);
    }
  }

  module.exports = Conexion;