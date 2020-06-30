var Conexion = require('../database/connection');

class Chat {
  constructor() {
    
  }
  //Funcion para mostrar los posts
  registermessage(id1, id2, mensaje, callback) {
    var conexion = new Conexion;
    conexion.connect(function (conn) {
      conn.query("INSERT INTO chat (idChat, idUsuarioUno, idUsuarioDos, mensaje, fecha) VALUES (null,'"+id1+"','"+id2+"','"+mensaje+"','now()')", (err, rows, fields) => {
        if (!err) {
          console.log(rows);
          callback(rows);
        } else {
          console.log(err);
        }
      });
    });
  }
  
  selectmessages(id1, id2, callback) {
    var conexion = new Conexion;
    conexion.connect(function (conn) {
      conn.query("SELECT c.*, u.nombre AS nombreuno, u.apellido AS apellidouno, u.idUsuario AS idUno, us.nombre AS nombredos, us.apellido AS apellidodos, us.idUsuario AS idDos FROM chat c INNER JOIN usuario u ON c.idUsuarioUno = u.idUsuario INNER JOIN usuario us ON c.idUsuarioDos = us.idUsuario WHERE (c.idUsuarioUno = '"+id1+"' AND c.idUsuarioDos = '"+id2+"') OR (c.idUsuarioUno = '"+id2+"' AND c.idUsuarioDos = '"+id1+"') ORDER BY c.idChat", (err, rows, fields) => {
        if (!err) {
          console.log(rows);
          callback(rows);
        } else {
          console.log('No hay mensajes');
        }
      });
    });
  }
  
  selectuserchat(id, callback) {
    var conexion = new Conexion;
    conexion.connect(function (conn) {
      conn.query("SELECT c.idUsuarioUno, c.idUsuarioDos, c.mensaje, u.*, us.nombre as nombreotro, us.apellido as apellidootro, us.idUsuario as idUsuariootro, us.foto as fotootro FROM chat c INNER JOIN usuario u ON c.idUsuarioDos = u.idUsuario INNER JOIN usuario us ON c.idUsuarioUno = us.idUsuario  WHERE c.idUsuarioUno = "+id+" OR c.idUsuarioDos = "+id+" GROUP BY c.idUsuarioDos", (err, rows, fields) => {
        if (!err) {
          console.log(rows);
          callback(rows);
        } else {
          console.log('No hay mensajes');
        }
      });
    });
  }

  selectotheruserchat(id, callback) {
    var conexion = new Conexion;
    conexion.connect(function (conn) {
      conn.query("SELECT c.idUsuarioUno, c.idUsuarioDos, c.mensaje, u.* FROM chat c INNER JOIN usuario u ON c.idUsuarioUno = u.idUsuario WHERE c.idUsuarioUno = "+id+" OR c.idUsuarioDos = "+id+" GROUP BY c.idUsuarioDos", (err, rows, fields) => {
        if (!err) {
          console.log(rows);
          callback(rows);
        } else {
          console.log('No hay mensajes');
        }
      });
    });
  }
  
}

module.exports = Chat;