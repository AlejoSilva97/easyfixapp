var Conexion = require('../database/connection');

class User {
    constructor() {
      
    }
    //Funcion que se encarga de el login
    login(correo, clave, callback) {
        var conexion = new Conexion;
        conexion.connect(function (conn) {
            conn.query("SELECT u.*, t.nombre as tipousuario FROM usuario u INNER JOIN tipousuario t ON u.idTipo = t.idTipo WHERE correo = '"+correo+"' and contraseña ='"+clave+"'", (err, rows, fields) => {
                if (!err) {
                  console.log(rows);
                  callback(rows);
                } else {
                  console.log(err);
                }
              });
        });
    }

    //Funcion que se encarga de registrar usuariosNormales (por el momento)
    registroUsuario(nombre, apellido, correo, clave, telefono, foto, callback) {
      var conexion = new Conexion;
      if (telefono == null || telefono == undefined || telefono == "") {
        telefono = 0;
      }
      conexion.connect(function (conn) {
        conn.query("INSERT INTO usuario (idUsuario, idTipo,nombre, apellido, correo, contraseña, descripcion, telefono, estado, categoria, foto) VALUES (null,'1','"+nombre+"','"+apellido+"','"+correo+"','"+clave+"',null,"+telefono+",null,null,'"+foto+"')", (err, rows, fields) => {
          if (!err) {
            console.log(rows);
            callback(rows);
          } else {
            console.log(err);
          }
        });
      });
    }

    //Funcion que se encarga de registrar Prestadores de servicios
    registroPrestador(nombre, apellido, correo, clave, descripcion, telefono, categoria, foto, callback) {
      var conexion = new Conexion;
      conexion.connect(function (conn) {
        conn.query("INSERT INTO usuario (idUsuario, idTipo,nombre, apellido, correo, contraseña, descripcion, telefono, estado, categoria, foto) VALUES (null,'2','"+nombre+"','"+apellido+"','"+correo+"','"+clave+"','"+descripcion+"',"+telefono+",null,'"+categoria+"','"+foto+"')", (err, rows, fields) => {
          if (!err) {
            console.log(rows);
            callback(rows);
          } else {
            console.log(err);
          }
        });
      });
    }

    //Funcion que se encarga de mostrar el perfil del Cliente.
    mostrarPerfil(id, callback) {
      var conexion = new Conexion;
      conexion.connect(function (conn) {
        conn.query("SELECT u.*, p.idPublicacion, p.idUsuario as idUsuarioPublicacion, p.titulo, tu.nombre as tipousuario, p.foto as foto_publicacion, p.descripcion as descripcion_pub, p.fecha, p.estado FROM usuario u INNER JOIN publicacion p ON p.idUsuario = u.idUsuario INNER JOIN tipousuario tu ON u.idTipo = tu.idTipo WHERE u.idUsuario = '"+id+"'", (err, rows, fields) => {
          if (!err) {
            console.log(rows);
            callback(rows);
          } else {
            console.log(err);
          }
        });

      });
    }

    //Funcion que se encarga de mostrar el perfil del Tecnico
    mostrarPerfilTecnico(id, callback) {
      var conexion = new Conexion;
      conexion.connect(function (conn) {
        conn.query("SELECT u.*, tu.nombre as tipousuario FROM usuario u INNER JOIN tipousuario tu ON u.idTipo = tu.idTipo WHERE u.idUsuario = '"+id+"'", (err, rows, fields) => {
          if (!err) {
            console.log(rows);
            callback(rows);
          } else {
            console.log(err);
          }
        });

      });
    }

    //Funcion que se encarga de mostrar los tecnicos por categorias
    tecnicoCategoria(categoria, callback) {
      var conexion = new Conexion;
      conexion.connect(function (conn) {
        conn.query("SELECT u.*, tu.nombre as tipousuario FROM usuario u INNER JOIN tipousuario tu ON u.idTipo = tu.idTipo WHERE u.categoria = '"+categoria+"'", (err, rows, fields) => {
          if (!err) {
            console.log(rows);
            callback(rows);
          } else {
            console.log(err);
          }
        });

      });
    }

    //Funcion que se encarga de mostrar los tecnicos por categorias
    editarUsuario(id, nombre, apellido, correo, descripcion, telefono, categoria, callback) {
      if(descripcion == undefined || descripcion == ""){
        descripcion = null;
      }
      if(categoria == undefined || categoria == ""){
        categoria = null;
      }
      
      var conexion = new Conexion;
      conexion.connect(function (conn) {
        conn.query("UPDATE usuario SET nombre = '"+nombre+"', apellido = '"+apellido+"', correo = '"+correo+"', descripcion = '"+descripcion+"', telefono = '"+telefono+"', categoria = '"+categoria+"' WHERE idUsuario = "+id+"", (err, rows, fields) => {
          if (!err) {
            console.log(rows);
            callback(rows);
          } else {
            console.log(err);
          }
        });

      });
    }

    //Funcion que se encarga de actualizar contraseña
    updatePassword(id, clave, callback) {
      var conexion = new Conexion;
      conexion.connect(function (conn) {
        conn.query("UPDATE usuario SET contraseña = '"+clave+"' WHERE idUsuario = "+id+"", (err, rows, fields) => {
          if (!err) {
            console.log(rows);
            callback(rows);
          } else {
            console.log(err);
          }
        });
      });
    }

//Funcion que se encarga de editar foto de usuario
editarPhoto(id, foto, callback) {      
  var conexion = new Conexion;
  conexion.connect(function (conn) {
    conn.query("UPDATE usuario SET foto = '"+foto+"' WHERE idUsuario = "+id+"", (err, rows, fields) => {
      if (!err) {
        console.log(rows);
        callback(rows);
      } else {
        console.log(err);
      }
    });

  });
}

    //Funcion que se encarga de consultar el correo
    consulcorreo(correo, callback) {
      var conexion = new Conexion;
      conexion.connect(function (conn) {
        conn.query("SELECT * FROM usuario WHERE correo = '"+correo+"'", (err, rows, fields) => {
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

  

  module.exports = User;