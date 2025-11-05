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


subscribePOSTEvent("verPerfil", function(data) {
  let usuarios = leerUsuarios();
  let usuario = null;

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === data.email) {
      usuario = usuarios[i];
    }
  }

  if (usuario === null) {
    return { msg: "Usuario no encontrado.", exito: false };
  }

  return { msg: usuario, exito: true };
});
subscribePOSTEvent("guardarPerfil", function(data) {
  let usuarios = leerUsuarios();
  let actualizado = false;

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === data.email) {
      usuarios[i].nombre = data.nombre;
      usuarios[i].edad = data.edad;
      usuarios[i].genero = data.genero;
      usuarios[i].instrumento = data.instrumento;
      usuarios[i]["genero musical"] = data["genero musical"];
      actualizado = true;
    }
  }

  if (actualizado) {
    guardarUsuarios(usuarios);
    return { msg: "Cambios guardados correctamente.", exito: true };
  }

  return { msg: "No se encontró el usuario.", exito: false };
});

subscribePOSTEvent("busquedaUsuario", function(data){
  let usuarios = fs.readFileSync("Back-end/index.js","utf-8");
  let encontrado = null
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].nombre === "") {
        encontrado = usuarios[i];
        break; 
    }
}
console.log("Usuario encontrado:", encontrado);

})

startServer(3000);