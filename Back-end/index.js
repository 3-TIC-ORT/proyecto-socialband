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
  try {
    let contenido = fs.readFileSync("Back-end/posteos.json", "utf-8");
    if (!contenido.trim()) return [];
    return JSON.parse(contenido);
  } catch (e) {
    return [];
  }
}

function guardarPosteos(posteos) {
  fs.writeFileSync("Back-end/posteos.json", JSON.stringify(posteos, null, 2));
}

subscribePOSTEvent("crearPosteo", function (data) {
  let posteos = leerPosteos();
  let usuarios = leerUsuarios();

  let nombreAutor = data.autorEmail;
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === data.autorEmail) {
      nombreAutor = usuarios[i].nombre;
      break;
    }
  }

  let nuevoPost = {
    id: Date.now(),
    autorEmail: data.autorEmail,
    autorNombre: nombreAutor,
    titulo: data.titulo,
    contenido: data.contenido,
    fecha: new Date().toLocaleString(),
    likes: 0,
    comentarios: []
  };

  posteos.push(nuevoPost);
  guardarPosteos(posteos);
  return { msg: "Posteo creado correctamente.", exito: true };
});

subscribePOSTEvent("verPosteos", function () {
  return { msg: leerPosteos(), exito: true };
});

subscribePOSTEvent("darLike", function (data) {
  let posteos = leerPosteos();
  let ok = false;

  for (let i = 0; i < posteos.length; i++) {
    if (posteos[i].id === data.idPost) {
      posteos[i].likes = (posteos[i].likes || 0) + 1;
      ok = true;
      break;
    }
  }

  if (ok) {
    guardarPosteos(posteos);
    return { msg: "Like registrado.", exito: true };
  }

  return { msg: "Posteo no encontrado.", exito: false };
});

subscribePOSTEvent("comentarPosteo", function (data) {
  let posteos = leerPosteos();
  let usuarios = leerUsuarios();
  let ok = false;

  let nombreAutor = data.autorEmail;
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === data.autorEmail) {
      nombreAutor = usuarios[i].nombre;
      break;
    }
  }

  for (let i = 0; i < posteos.length; i++) {
    if (posteos[i].id === data.idPost) {
      posteos[i].comentarios = posteos[i].comentarios || [];
      posteos[i].comentarios.push({
        autor: nombreAutor,
        texto: data.texto,
        fecha: new Date().toLocaleString()
      });
      ok = true;
      break;
    }
  }

  if (ok) {
    guardarPosteos(posteos);
    return { msg: "Comentario agregado.", exito: true };
  }

  return { msg: "Posteo no encontrado.", exito: false };
});

subscribePOSTEvent("buscarPosteos", function (data) {
  let texto = (data.texto || "").toLowerCase();
  let posteos = leerPosteos();

  if (texto === "") {
    return { msg: posteos, exito: true };
  }

  let res = posteos.filter(p =>
    p.titulo.toLowerCase().includes(texto) ||
    p.contenido.toLowerCase().includes(texto) ||
    p.autorNombre.toLowerCase().includes(texto)
  );

  return { msg: res, exito: true };
});

subscribePOSTEvent("filtrarPosteos", function (data) {
  let posteos = leerPosteos();
  let tipo = data.tipo;

  if (tipo === "recientes") {
    posteos.sort((a, b) => b.id - a.id);
  } else if (tipo === "likes") {
    posteos.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (tipo === "alfabetico") {
    posteos.sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  return { msg: posteos, exito: true };
});
