import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

subscribePOSTEvent("registroUsuario", function (data) {

  let texto = fs.readFileSync("Back-end/usuarios.json", "utf-8");
  let usuarios = texto === "" ? [] : JSON.parse(texto);

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

  fs.writeFileSync("Back-end/usuarios.json", JSON.stringify(usuarios, null, 2));

  return { msg: "Usuario registrado correctamente.", exito: true };
});


subscribePOSTEvent("loginUsuario", function (data) {

  let texto = fs.readFileSync("Back-end/usuarios.json", "utf-8");
  let usuarios = texto === "" ? [] : JSON.parse(texto);

  let encontrado = false;
  let nombre = "";

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === data.email &&
        usuarios[i].contraseña === data.contraseña) {
      encontrado = true;
      nombre = usuarios[i].nombre;
    }
  }

  if (encontrado) {
    return { msg: "Bienvenido " + nombre, exito: true };
  }

  return { msg: "Correo o contraseña incorrectos.", exito: false };
});




subscribePOSTEvent("verPerfil", function (data) {

  let texto = fs.readFileSync("Back-end/usuarios.json", "utf-8");
  let usuarios = texto === "" ? [] : JSON.parse(texto);

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

  let texto = fs.readFileSync("Back-end/usuarios.json", "utf-8");
  let usuarios = texto === "" ? [] : JSON.parse(texto);

  let modificado = false;

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === data.email) {
      usuarios[i].nombre = data.nombre;
      usuarios[i].edad = data.edad;
      usuarios[i].genero = data.genero;
      usuarios[i].instrumento = data.instrumento;
      usuarios[i]["genero musical"] = data["genero musical"];
      modificado = true;
    }
  }

  if (modificado) {
    fs.writeFileSync("Back-end/usuarios.json", JSON.stringify(usuarios, null, 2));
    return { msg: "Perfil actualizado.", exito: true };
  }

  return { msg: "No se encontró el usuario.", exito: false };
});


subscribePOSTEvent("crearPosteo", function (data) {

  let textoPost = fs.readFileSync("Back-end/posteos.json", "utf-8");
  let posteos = textoPost === "" ? [] : JSON.parse(textoPost);

  let textoUsu = fs.readFileSync("Back-end/usuarios.json", "utf-8");
  let usuarios = textoUsu === "" ? [] : JSON.parse(textoUsu);

  let autorNombre = "Desconocido";

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === data.autorEmail) {
      autorNombre = usuarios[i].nombre;
    }
  }

  let nuevoPost = {
    id: posteos.length + 1,
    autorEmail: data.autorEmail,
    autorNombre: autorNombre,
    titulo: data.titulo,
    contenido: data.contenido,
    likes: [],
    comentarios: []
  };

  posteos.push(nuevoPost);

  fs.writeFileSync("Back-end/posteos.json", JSON.stringify(posteos, null, 2));

  return { msg: "Posteo creado correctamente.", exito: true };
});



subscribePOSTEvent("verPosteos", function () {
  let texto = fs.readFileSync("Back-end/posteos.json", "utf-8");
  let posteos = texto === "" ? [] : JSON.parse(texto);
  return { msg: posteos, exito: true };
});


subscribePOSTEvent("darLike", function (data) {

  let texto = fs.readFileSync("Back-end/posteos.json", "utf-8");
  let posteos = texto === "" ? [] : JSON.parse(texto);

  let encontrado = false;

  for (let i = 0; i < posteos.length; i++) {
    if (posteos[i].id === data.idPost) {

      let yaDio = false;

      for (let j = 0; j < posteos[i].likes.length; j++) {
        if (posteos[i].likes[j] === data.email) {
          yaDio = true;
        }
      }

      if (yaDio === false) {
        posteos[i].likes.push(data.email);
      } else {
        let nuevo = [];
        for (let j = 0; j < posteos[i].likes.length; j++) {
          if (posteos[i].likes[j] !== data.email) {
            nuevo.push(posteos[i].likes[j]);
          }
        }
        posteos[i].likes = nuevo;
      }

      encontrado = true;
    }
  }

  if (encontrado) {
    fs.writeFileSync("Back-end/posteos.json", JSON.stringify(posteos, null, 2));
    return { msg: "Like actualizado.", exito: true };
  }

  return { msg: "Posteo no encontrado.", exito: false };
});



subscribePOSTEvent("comentarPosteo", function (data) {

  let textoPost = fs.readFileSync("Back-end/posteos.json", "utf-8");
  let posteos = textoPost === "" ? [] : JSON.parse(textoPost);

  let textoUsu = fs.readFileSync("Back-end/usuarios.json", "utf-8");
  let usuarios = textoUsu === "" ? [] : JSON.parse(textoUsu);

  let nombre = "Desconocido";

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === data.autorEmail) {
      nombre = usuarios[i].nombre;
    }
  }

  let ok = false;

  for (let i = 0; i < posteos.length; i++) {
    if (posteos[i].id === data.idPost) {

      posteos[i].comentarios.push({
        autorNombre: nombre,
        autorEmail: data.autorEmail,
        texto: data.texto
      });

      ok = true;
    }
  }

  if (ok) {
    fs.writeFileSync("Back-end/posteos.json", JSON.stringify(posteos, null, 2));
    return { msg: "Comentario agregado.", exito: true };
  }

  return { msg: "Posteo no encontrado.", exito: false };
});


subscribePOSTEvent("buscarPosteos", function (data) {

  let texto = fs.readFileSync("Back-end/posteos.json", "utf-8");
  let posteos = texto === "" ? [] : JSON.parse(texto);

  let buscado = data.texto;
  let resultados = [];

  for (let i = 0; i < posteos.length; i++) {

    let t = posteos[i].titulo;
    let c = posteos[i].contenido;
    let a = posteos[i].autorNombre;

    let coincide = false;

    if (t === buscado) { coincide = true; }
    if (c === buscado) { coincide = true; }
    if (a === buscado) { coincide = true; }

    if (coincide) {
      resultados.push(posteos[i]);
    }
  }

  return { msg: resultados, exito: true };
});


subscribePOSTEvent("enviarSolicitud", function (data) {

  let texto = fs.readFileSync("Back-end/solicitudes.json", "utf-8");
  let solicitudes = texto === "" ? [] : JSON.parse(texto);

  if (data.de === data.para) {
    return { msg: "No podés enviarte solicitud.", exito: false };
  }

  for (let i = 0; i < solicitudes.length; i++) {
    if (solicitudes[i].de === data.de &&
        solicitudes[i].para === data.para &&
        solicitudes[i].estado === "pendiente") {
      return { msg: "Ya enviaste una solicitud.", exito: false };
    }
  }

  solicitudes.push({
    id: solicitudes.length + 1,
    de: data.de,
    para: data.para,
    estado: "pendiente"
  });

  fs.writeFileSync("Back-end/solicitudes.json", JSON.stringify(solicitudes, null, 2));

  return { msg: "Solicitud enviada.", exito: true };
});


subscribePOSTEvent("verSolicitudes", function (data) {

  let textoSol = fs.readFileSync("Back-end/solicitudes.json", "utf-8");
  let solicitudes = textoSol === "" ? [] : JSON.parse(textoSol);

  let textoUsu = fs.readFileSync("Back-end/usuarios.json", "utf-8");
  let usuarios = textoUsu === "" ? [] : JSON.parse(textoUsu);

  let lista = [];

  for (let i = 0; i < solicitudes.length; i++) {
    let s = solicitudes[i];

    if (s.para === data.email && s.estado === "pendiente") {

      let nombreDe = s.de;

      for (let j = 0; j < usuarios.length; j++) {
        if (usuarios[j].email === s.de) {
          nombreDe = usuarios[j].nombre;
        }
      }

      lista.push({
        id: s.id,
        de: s.de,
        nombreDe: nombreDe
      });
    }
  }

  return { msg: lista, exito: true };
});


subscribePOSTEvent("responderSolicitud", function (data) {

  let texto = fs.readFileSync("Back-end/solicitudes.json", "utf-8");
  let solicitudes = texto === "" ? [] : JSON.parse(texto);

  let ok = false;

  for (let i = 0; i < solicitudes.length; i++) {
    if (solicitudes[i].id === data.idSolicitud &&
        solicitudes[i].estado === "pendiente") {

      if (data.accion === "aceptar") {
        solicitudes[i].estado = "aceptada";
      } else {
        solicitudes[i].estado = "rechazada";
      }

      ok = true;
    }
  }

  if (ok) {
    fs.writeFileSync("Back-end/solicitudes.json", JSON.stringify(solicitudes, null, 2));
    return { msg: "Solicitud respondida.", exito: true };
  }

  return { msg: "Solicitud no encontrada.", exito: false };
});



startServer(3000);
