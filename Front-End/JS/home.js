if (localStorage.getItem("logueado") !== "true") {
  window.location.href = "login.html";
}

document.getElementById("cerrarSesion").addEventListener("click", () => {
  localStorage.removeItem("logueado");
  window.location.href = "login.html";
});


let titulo = document.getElementById("titulo");
let contenido = document.getElementById("contenido");
let publicar = document.getElementById("publicar");
let listaPosteos = document.getElementById("listaPosteos");

let usuarioActual = localStorage.getItem("usuarioEmail") || "Anónimo";

function mostrarPosteos(posteos) {
  listaPosteos.innerHTML = "";

  if (posteos.length === 0) {
    listaPosteos.innerHTML = "<p>No hay posteos todavía.</p>";
    return;
  }

  for (let i = 0; i < posteos.length; i++) {
    let post = posteos[i];
    let div = document.createElement("div");
    div.className = "posteo";

    div.innerHTML =
      "<h3>" + post.titulo + "</h3>" +
      "<p><b>" + post.autor + "</b> - " + post.fecha + "</p>" +
      "<p>" + post.contenido + "</p>";

    listaPosteos.appendChild(div);
  }
}

realTimeEvent("verPosteos", {}, (respuesta) => {
  if (respuesta.exito === true) {
    mostrarPosteos(respuesta.msg);
  } else {
    listaPosteos.innerHTML = "<p>No hay posteos todavía.</p>";
  }
});

publicar.addEventListener("click", () => {
  let data = {
    autor: usuarioActual,
    titulo: titulo.value,
    contenido: contenido.value,
    fecha: new Date().toLocaleDateString()
  };

  postEvent("crearPosteo", data, (respuesta) => {
    alert(respuesta.msg);

    if (respuesta.exito === true) {
      realTimeEvent("verPosteos", {}, (r) => {
        mostrarPosteos(r.msg);
      });

      titulo.value = "";
      contenido.value = "";
    }
  });
});
