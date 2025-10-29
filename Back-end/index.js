import fs from "fs"
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";



function leerUsuarios() {
  let contenido = fs.readFileSync("Back-end/usuarios.json", "utf-8");
  let usuarios = JSON.parse(contenido);
  return usuarios;
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync("Back-end/usuarios.json", JSON.stringify(usuarios, null, 2));
}

subscribePOSTEvent("registroUsuario", function(data) {
  let usuarios = leerUsuarios();

  let existe = false;
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === data.email) {
      existe = true;
    }
  }

  if (existe) {
    return { msg: "Correo ya registrado.", exito: false };
  }

  usuarios.push(data);
  guardarUsuarios(usuarios);

  return { msg: "Usuario registrado correctamente.", exito: true };
});

subscribePOSTEvent("loginUsuario", function(data) {
  let usuarios = leerUsuarios();
  let encontrado = false;
  let nombre = "";

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === data.email && usuarios[i].contraseña === data.contraseña) {
      encontrado = true;
      nombre = usuarios[i].nombre;
    }
  }

  if (encontrado) {
    return { msg: "Bienvenido " + nombre, exito: true };
  } else {
    return { msg: "Correo o contraseña incorrectos.", exito: false };
  }
});


function leerUsuariosPerfil () {
  let cont = fs.readFileSync("Back-end/usuarios.json" , "utf-8")
  let users = JSON.parse(cont)
}
function guardarUsuariosPerfil (users){
fs.writeFileSync("Back-end/usuarios.json", JSON.stringify(users, null, 2));
}
subscribePOSTEvent ("perfilUsuario", function(data){

});


startServer(3000);
