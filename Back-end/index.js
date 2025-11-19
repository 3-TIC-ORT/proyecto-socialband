import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

// ==================== USUARIOS ====================

function leerUsuarios() {
  let contenido = fs.readFileSync("Back-end/usuarios.json", "utf-8");
  let usuarios = JSON.parse(contenido);
  return usuarios;
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync("Back-end/usuarios.json", JSON.stringify(usuarios, null, 2));
}

subscribePOSTEvent("registroUsuario", function (data) {
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

subscribePOSTEvent("loginUsuario", function (data) {
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

subscribePOSTEvent("verPerfil", function (data) {
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

subscribePOSTEvent("guardarPerfil", function (data) {
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
    let posteos = JSON.parse(contenido);
    return posteos;
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
    likes: [],
    comentarios: []
  };

  posteos.push(nuevoPost);
  guardarPosteos(posteos);
  return { msg: "Posteo creado correctamente.", exito: true };
});

subscribePOSTEvent("verPosteos", function () {
  let posteos = leerPosteos();
  let usuarios = leerUsuarios();
  let ahora = Date.now();

  for (let i = 0; i < posteos.length; i++) {
    if (!posteos[i].id) {
      posteos[i].id = ahora + i;
    }
    if (!Array.isArray(posteos[i].likes)) {
      if (typeof posteos[i].likes === "number") {
        posteos[i].likes = [];
      } else {
        posteos[i].likes = [];
      }
    }
    if (!Array.isArray(posteos[i].comentarios)) {
      posteos[i].comentarios = [];
    }
    if (!posteos[i].autorNombre || posteos[i].autorNombre === "Desconocido") {
      for (let j = 0; j < usuarios.length; j++) {
        if (usuarios[j].email === posteos[i].autorEmail) {
          posteos[i].autorNombre = usuarios[j].nombre;
          break;
        }
      }
      if (!posteos[i].autorNombre) {
        posteos[i].autorNombre = "Desconocido";
      }
    }
  }

  guardarPosteos(posteos);
  return { msg: posteos, exito: true };
});

subscribePOSTEvent("darLike", function (data) {
  let posteos = leerPosteos();
  let ok = false;

  for (let i = 0; i < posteos.length; i++) {
    if (posteos[i].id === data.idPost) {
      if (!Array.isArray(posteos[i].likes)) {
        posteos[i].likes = [];
      }
      let idx = posteos[i].likes.indexOf(data.email);
      if (idx === -1) {
        posteos[i].likes.push(data.email);
      } else {
        posteos[i].likes.splice(idx, 1);
      }
      ok = true;
      break;
    }
  }

  if (ok) {
    guardarPosteos(posteos);
    return { msg: "Like actualizado.", exito: true };
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
      if (!Array.isArray(posteos[i].comentarios)) {
        posteos[i].comentarios = [];
      }
      posteos[i].comentarios.push({
        autorNombre: nombreAutor,
        autorEmail: data.autorEmail,
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

  let res = [];
  for (let i = 0; i < posteos.length; i++) {
    let p = posteos[i];
    let autor = p.autorNombre || "";
    let coincide =
      p.titulo.toLowerCase().includes(texto) ||
      p.contenido.toLowerCase().includes(texto) ||
      autor.toLowerCase().includes(texto);

    if (coincide) {
      res.push(p);
    }
  }

  return { msg: res, exito: true };
});

subscribePOSTEvent("filtrarPosteos", function (data) {
  let posteos = leerPosteos();
  let tipo = data.tipo;

  if (tipo === "recientes") {
    posteos.sort(function (a, b) {
      return b.id - a.id;
    });
  } else if (tipo === "likes") {
    posteos.sort(function (a, b) {
      let la = Array.isArray(a.likes) ? a.likes.length : 0;
      let lb = Array.isArray(b.likes) ? b.likes.length : 0;
      return lb - la;
    });
  } else if (tipo === "alfabetico") {
    posteos.sort(function (a, b) {
      return a.titulo.localeCompare(b.titulo);
    });
  }

  return { msg: posteos, exito: true };
});

function leerSolicitudes() {
  try {
    let contenido = fs.readFileSync("Back-end/solicitudes.json", "utf-8");
    if (!contenido.trim()) return [];
    let solicitudes = JSON.parse(contenido);
    return solicitudes;
  } catch (e) {
    return [];
  }
}

function guardarSolicitudes(solicitudes) {
  fs.writeFileSync("Back-end/solicitudes.json", JSON.stringify(solicitudes, null, 2));
}

subscribePOSTEvent("enviarSolicitud", function (data) {
  if (!data.de || !data.para) {
    return { msg: "Datos incompletos.", exito: false };
  }

  if (data.de === data.para) {
    return { msg: "No te podés enviar solicitud a vos mismo.", exito: false };
  }

  let solicitudes = leerSolicitudes();

  for (let i = 0; i < solicitudes.length; i++) {
    if (
      solicitudes[i].de === data.de &&
      solicitudes[i].para === data.para &&
      solicitudes[i].estado === "pendiente"
    ) {
      return { msg: "Ya enviaste una solicitud a este usuario.", exito: false };
    }
  }

  let nueva = {
    id: Date.now(),
    de: data.de,
    para: data.para,
    estado: "pendiente",
    fecha: new Date().toLocaleString()
  };

  solicitudes.push(nueva);
  guardarSolicitudes(solicitudes);

  return { msg: "Solicitud enviada.", exito: true };
});

subscribePOSTEvent("verSolicitudes", function (data) {
  let email = data.email;
  let solicitudes = leerSolicitudes();
  let usuarios = leerUsuarios();

  let recibidas = [];

  for (let i = 0; i < solicitudes.length; i++) {
    let s = solicitudes[i];
    if (s.para === email && s.estado === "pendiente") {
      let nombreDe = s.de;
      for (let j = 0; j < usuarios.length; j++) {
        if (usuarios[j].email === s.de) {
          nombreDe = usuarios[j].nombre;
          break;
        }
      }
      recibidas.push({
        id: s.id,
        de: s.de,
        nombreDe: nombreDe,
        fecha: s.fecha
      });
    }
  }

  return { msg: recibidas, exito: true };
});

subscribePOSTEvent("responderSolicitud", function (data) {
  let solicitudes = leerSolicitudes();
  let ok = false;

  for (let i = 0; i < solicitudes.length; i++) {
    if (solicitudes[i].id === data.idSolicitud && solicitudes[i].estado === "pendiente") {
      if (data.accion === "aceptar") {
        solicitudes[i].estado = "aceptada";
      } else {
        solicitudes[i].estado = "rechazada";
      }
      ok = true;
      break;
    }
  }

  if (ok) {
    guardarSolicitudes(solicitudes);
    return { msg: "Solicitud " + data.accion + "da.", exito: true };
  }

  return { msg: "Solicitud no encontrada.", exito: false };
});

startServer(3000);
