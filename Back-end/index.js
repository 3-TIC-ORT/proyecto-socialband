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

function leerPosteos() {
  let contenido = fs.readFileSync("Back-end/posteos.json", "utf-8");
  let posteos = JSON.parse(contenido);
  return posteos;
}

function guardarPosteos(posteos) {
  fs.writeFileSync("Back-end/posteos.json", JSON.stringify(posteos, null, 2));
}

subscribePOSTEvent("crearPosteo", function(data) {
  let posteos = leerPosteos();

  posteos.push(data);

  guardarPosteos(posteos);
  return { msg: "Posteo guardado correctamente.", exito: true };
});

subscribePOSTEvent("verPosteos", function() {
  let posteos = leerPosteos();
  return { msg: posteos, exito: true };
});


subscribePOSTEvent("busquedaUsuario", function(data) {
  let usuarios = leerUsuarios();
  let resultados = [];

  for (let i = 0; i < usuarios.length; i++) {
    let u = usuarios[i];
    let coincide = true;

    if (data.nombre !== "" && u.nombre !== data.nombre) {
      coincide = false;
    }
    if (data.instrumento !== "" && u.instrumento !== data.instrumento) {
      coincide = false;
    }
    if (data.genero !== "" && u.genero !== data.genero) {
      coincide = false;
    }

    if (coincide) {
      resultados.push(u);
    }
  }

  return { msg: resultados, exito: true };
});

startServer(3000);
