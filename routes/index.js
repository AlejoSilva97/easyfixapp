var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Posts = require('../models/posts');
var Chat = require('../models/chat');


/* GET home page. */
//Ruta inicial que muestra el login
router.get('/', function(req, res, next) {
  res.render('index');
});





//Ruta Para mostrar las publicaciones
router.get('/posts', function(req, res, next) {
  //Redireccionando en caso de que no haya ningun usuario logueado
  if(req.session.user == (null || undefined)){
    res.redirect('/');
  }
  var posts = new Posts();
  
  //LLamando funcion para mostrar posts
  posts.showPosts(function(posts) {
    //Mostrando la vista posts y pasandole los posts y el usuario logueado, asi con cada vista que necesite
    res.render('posts', { posts: posts, user:req.session.user});
  });
});


//Ruta Para guardar las publicaciones
router.post('/posts', function(req, res, next) {
  
  if(req.files){
    var file = req.files.foto;
    var nombrefoto = file.name;
    
    file.mv('./public/images/posts/'+nombrefoto, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
  
  var posts = new Posts();
  
  posts.registroPost(req.body.titulo, req.body.descripcion, nombrefoto, req.session.user, function(ok) {
    if(ok<1) {
      res.render('posts', { error: "No se pudo insertar la publicacion"});
    } else {
      res.redirect('/posts');
    }
  });
  
});



//Ruta para mostrar el registro de usuariosNormales
router.get('/register', function(req, res, next) {
  res.render('register');
});



//Ruta para mostrar el registro de Prestadores de servicios
router.get('/registerserviceman', function(req, res, next) {
  res.render('registerServiceMan');
});



//Ruta POST para el login
router.post('/login', function(req, res, next) {
  var user = new User();
  //LLAMANDO FUNCION QUE CONSULTA EL USUARIO PARA EL LOGIN -- CON CALLBACKS
  //Las funciones callback se ejecutan despues de que la funcion
  // que llamamos primero se ejecute osea la vuelva a llamar
  user.login(req.body.correo,req.body.clave, function (users) {
    
    if(users.length < 1) {
      //Error que se envia si no hay coincidencia en los datos
      res.render('index', { error: "Correo o contraseña incorrectos"});
      
    } else {
      //Guardar en session el usuario que esta logueado y redireccionar
      req.session.user = users[0];
      res.redirect('/posts');
    }
    
  });
  
});



//Ruta get para el logout
router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect('/');
});




//Ruta post para registrar Usuario normal
router.post('/register', function(req, res, next) {
  
  if(req.files){
    var file = req.files.foto;
    var nombrefoto = file.name;
    
    file.mv('./public/images/'+nombrefoto, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
  
  var user = new User();
  
  //Llamando funcion de registrar usuario normal con sus parametros y callback
  user.registroUsuario(req.body.nombres, req.body.apellidos, req.body.correo, req.body.clave, req.body.telefono, nombrefoto, function (ok) {
    if(ok<1) {
      res.render('register', { error: "No se pudo insertar el usuario"});
    } else {
      res.redirect('/');
    }
    
  });
  
});



//Ruta post para registrar Prestador de servicios
router.post('/registerserviceman', function(req, res, next) {
  
  if(req.files){
    var file = req.files.foto;
    var nombrefoto = file.name;
    
    file.mv('./public/images/'+nombrefoto, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
  
  var user = new User();
  
  //Llamando funcion de registrar prestador de servicios con sus parametros y callback
  user.registroPrestador(req.body.nombre, req.body.apellido, req.body.correo, req.body.clave, req.body.descripcion, req.body.telefono, req.body.categoria, nombrefoto, function (ok) {
    if(ok<1) {
      res.render('registerserviceman', { error: "No se pudo insertar el usuario"});
    } else {
      res.redirect('/');
    }
    
  });
});

//Ruta Para mostrar perfil de Cliente
router.get('/profile/:id', function(req, res, next) {
  //Redireccionando en caso de que no haya ningun usuario logueado
  if(req.session.user == (null || undefined)){
    res.redirect('/');
  }
  var id = req.params.id;
  
  var user = new User();
  
  user.mostrarPerfil(id, function(usuario) {
    if(usuario[0] == undefined){
      res.redirect('/profileserviceman/'+id);
    }
    //Mostrando la vista posts y pasandole los posts y el usuario logueado, asi con cada vista que necesite
    res.render('profile', { usuario: usuario, user:req.session.user});
  });
  
});

//Ruta Para mostrar perfil de Tecnico
router.get('/profileserviceman/:id', function(req, res, next) {
  //Redireccionando en caso de que no haya ningun usuario logueado
  if(req.session.user == (null || undefined)){
    res.redirect('/');
  }
  var id = req.params.id;
  
  var user = new User();
  
  user.mostrarPerfilTecnico(id, function(usuario) {
    //Mostrando la vista posts y pasandole los posts y el usuario logueado, asi con cada vista que necesite
    res.render('profileserviceman', { usuario: usuario, user:req.session.user});
  });
  
});

//Ruta Para mostrar Tecnicos por categorias
router.get('/serviceman/:categoria', function(req, res, next) {
  //Redireccionando en caso de que no haya ningun usuario logueado
  if(req.session.user == (null || undefined)){
    res.redirect('/');
  }
  var categoria = req.params.categoria;
  
  var user = new User();
  
  user.tecnicoCategoria(categoria, function(usuarios) {
    //Mostrando la vista posts y pasandole los posts y el usuario logueado, asi con cada vista que necesite
    if (usuarios[0] == undefined) {
      res.render('serviceman', { error: "No hay usuarios para mostrar", user:req.session.user});
    } else {
      res.render('serviceman', { usuarios: usuarios, user:req.session.user});
    }
  });
  
});

//Ruta get para editar el perfil del usuario
router.get('/edituser/:id', function(req, res, next) {
  //Redireccionando en caso de que no haya ningun usuario logueado
  if(req.session.user == (null || undefined)){
    res.redirect('/');
  }
  
  res.render('edituser', { user:req.session.user});
  
});

//Ruta post para editar el perfil de usuario
router.post('/edituser', function(req, res, next) {
  
  var id = req.session.user.idUsuario;
  
  var user = new User();
  
  //Llamando funcion de registrar usuario normal con sus parametros y callback
  user.editarUsuario(req.session.user.idUsuario, req.body.nombre, req.body.apellido, req.body.correo, req.body.descripcion, req.body.telefono, req.body.categoria, function (ok) {
    if(ok.affectedRows < 1) {
      res.render('edituser', { error: "No se pudo actualizar el usuario"});
    } else {
      res.redirect('/profile/'+id);
    }
    
  });
  
});

//Ruta get para mostrar pagina editar contraseña del usuario
router.get('/editpass/:id', function(req, res, next) {
  //Redireccionando en caso de que no haya ningun usuario logueado
  if(req.session.user == (null || undefined)){
    res.redirect('/');
  }
  
  res.render('editpass', { user:req.session.user});
  
});

//Ruta post para editar la contraseña del usuario
router.post('/editpass', function(req, res, next) {
  
  var id = req.session.user.idUsuario;
  
  var user = new User();
  
  //Llamando funcion de registrar usuario normal con sus parametros y callback
  user.updatePassword(req.session.user.idUsuario,req.body.clave, function (ok) {
    if(ok.affectedRows < 1) {
      res.render('editpass', { error: "No se pudo actualizarla contraseña"});
    } else {
      res.redirect('/profile/'+id);
    }
  });
});

//Ruta get para mostrar la pagina de editar foto del usuario
router.get('/editphoto/:id', function(req, res, next) {
  //Redireccionando en caso de que no haya ningun usuario logueado
  if(req.session.user == (null || undefined)){
    res.redirect('/');
  }
  
  res.render('editphoto', { user:req.session.user});
  
});

//Ruta post para editar foto
router.post('/editphoto', function(req, res, next) {
  
  if(req.files){
    var file = req.files.foto;
    var nombrefoto = file.name;
    
    file.mv('./public/images/'+nombrefoto, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
  
  var id = req.session.user.idUsuario;
  
  var user = new User();
  
  //Llamando funcion de registrar prestador de servicios con sus parametros y callback
  user.editarPhoto(req.session.user.idUsuario, nombrefoto, function (ok) {
    if(ok<1) {
      res.render('editphoto', { error: "No se pudo actualizar la imagen"});
    } else {
      res.redirect('/profile/'+id);
    }
    
  });
});

//Ruta get para mostrar la pagina de  ingresar el correo
router.get('/recopass', function(req, res, next) {
  //Redireccionando en caso de que no haya ningun usuario logueado
  
  res.render('recopass');
  
});

//Ruta post para consultar el correo
router.post('/recopass', function(req, res, next) {
  
  var user = new User();
  
  //Llamando funcion de registrar usuario normal con sus parametros y callback
  user.consulcorreo(req.body.correo, function (ok) {
    if(ok < 1) {
      res.render('recopass', { error: "No se pudo consultar el correo"});
    } else {
      var correo = ok[0].correo;
      var id = ok[0].idUsuario;
      res.redirect('/viewcorreo/'+id+'/'+correo);
    }
  });
});

//Ruta get para recuperar contraseña
router.get('/viewcorreo/:id/:correo', function(req, res, next) {
  //Redireccionando en caso de que no haya ningun usuario logueado
  
  var id = req.params.id;
  var correo = req.params.correo;
  
  res.render('viewcorreo',{id:id,correo:correo});
  
});

router.post('/viewcorreo', function(req, res, next) {
  
  var user = new User();
  
  //Llamando funcion de registrar usuario normal con sus parametros y callback
  user.updatePassword(req.body.id,req.body.clave, function (ok) {
    if(ok.affectedRows < 1) {
      res.render('viewcorreo', { error: "No se pudo actualizarla contraseña"});
    } else {
      res.redirect('/');
    }
  });
});

//Ruta Para mostrar Chat
router.get('/currentchat/:id1/:id2', function(req, res, next) {
  //Redireccionando en caso de que no haya ningun usuario logueado
  if(req.session.user == (null || undefined)){
    res.redirect('/');
  }
  var id1 = req.params.id1;
  var id2 = req.params.id2;
  
  var chat = new Chat();
  
  if (req.session.user.idUsuario == id2) {
    chat.selectmessages(req.session.user.idUsuario, id1, function(mensajes) {
      if (mensajes < 1 || mensajes == undefined) {
        res.render('currentchat', { user:req.session.user, destino:id2, error:'No hay mensajes para mostrar, Inicia una conversacion'});
      }
      res.render('currentchat', { user:req.session.user, destino:id2, mensajes:mensajes});
    }); 
  } else {
    chat.selectmessages(req.session.user.idUsuario, id2, function(mensajes) {
      if (mensajes < 1 || mensajes == undefined) {
        res.render('currentchat', { user:req.session.user, destino:id2, error:'No hay mensajes para mostrar, Inicia una conversacion'});
      }
      res.render('currentchat', { user:req.session.user, destino:id2, mensajes:mensajes});
    }); 
  } 
});

//Ruta post para guardar mensajes en bd
router.post('/message', function(req, res, next) {
  
  req.app.io.emit('message', {mensaje:req.body.mensaje});

  var id = req.session.user.idUsuario;
  var destino = req.body.id_destino;
  
  var chat = new Chat();
  
  //Llamando funcion de registrar mensajes
  chat.registermessage(id, destino, req.body.mensaje, function (ok) {
    if(ok < 1) {
      res.render('currentchat', { error: "No hay mensajes"});
    } else {
      res.redirect('/currentchat/'+id+'/'+destino+'#formulario');
    }
    
  });
  
});


router.get('/messages/:id', function(req, res, next) {
  //Redireccionando en caso de que no haya ningun usuario logueado
  if(req.session.user == (null || undefined)){
    res.redirect('/');
  }
  
  var chat = new Chat();

  chat.selectuserchat(req.session.user.idUsuario, function(chats) {
    if (chats[0] == undefined) {
      res.render('messages', {user:req.session.user, error: "No hay chats para mostrar"});
    } else {

        res.render('messages', { user:req.session.user, chats:chats});
    }
    
  });
});

//Ruta post para consultar el correo
router.post('/deletepost', function(req, res, next) {
  
  var post = new Posts();
  
  //Llamando funcion de registrar usuario normal con sus parametros y callback
  post.borrarpost(req.body.idpub, function (ok) {
    if(ok < 1) {
      res.render('recopass', { error: "No se pudo Eliminar la publicacion"});
    } else {
      res.redirect('/posts');
    }
  });
});

//Ruta post para consultar el correo
router.post('/closepost', function(req, res, next) {
  
  var post = new Posts();
  
  //Llamando funcion de registrar usuario normal con sus parametros y callback
  post.cerrarpost(req.body.idpub, function (ok) {
    if(ok < 1) {
      res.render('recopass', { error: "No se pudo Eliminar la publicacion"});
    } else {
      res.redirect('/posts');
    }
  });
});


module.exports = router;
