var Conexion = require('../database/connection');

class Service {
    constructor() {
      
    }

    registroservicio(id, iduser, callback) {
      var conexion = new Conexion;
      
      conexion.connect(function (conn) {
        conn.query("INSERT INTO servicio (idServicio, idPublicacion, idUsuario) VALUES (null,'"+id+"','"+iduser+"')", (err, rows, fields) => {
          if (!err) {
            console.log(rows);
            callback(rows);
          } else {
            console.log(err);
          }
        });
      });
    }

  }

  module.exports = Service;