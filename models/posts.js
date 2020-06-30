var Conexion = require('../database/connection');

class Posts {
    constructor() {
      
    }
    //Funcion para mostrar los posts
    showPosts(callback) {
        var conexion = new Conexion;
        conexion.connect(function (conn) {
            conn.query("SELECT p.*, u.nombre as nombreusuario, u.apellido as apellidousuario, u.foto as fotouser FROM publicacion p INNER JOIN usuario u ON p.IdUsuario = u.idUsuario ORDER BY p.idPublicacion DESC", (err, rows, fields) => {
                if (!err) {
                  console.log(rows);
                  callback(rows);
                } else {
                  console.log(err);
                }
              });
        });
    }

    registroPost(titulo, descripcion, foto, user, callback) {
      var conexion = new Conexion;
      var id = user.idUsuario;
      conexion.connect(function (conn) {
        conn.query("INSERT INTO publicacion (idPublicacion, titulo, foto, descripcion, fecha, idUsuario, estado) VALUES (null,'"+titulo+"','"+foto+"','"+descripcion+"',NOW(),'"+id+"','Abierto')", (err, rows, fields) => {
          if (!err) {
            console.log(rows);
            callback(rows);
          } else {
            console.log(err);
          }
        });
      });
    }

    borrarpost(id, callback) {
      var conexion = new Conexion;
      conexion.connect(function (conn) {
        conn.query("DELETE FROM publicacion WHERE idPublicacion ="+id, (err, rows, fields) => {
          if (!err) {
            console.log(rows);
            callback(rows);
          } else {
            console.log(err);
          }
        });
      });
    }

    cerrarpost(id, callback) {
      var conexion = new Conexion;
      conexion.connect(function (conn) {
        conn.query("UPDATE publicacion SET estado = 'Cerrado' WHERE idPublicacion ="+id, (err, rows, fields) => {
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

  module.exports = Posts;