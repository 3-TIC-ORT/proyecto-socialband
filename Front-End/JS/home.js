connect2Server();

if (localStorage.getItem("logueado") !== "true") {
  window.location.href = "login.html";
}

var btnCerrarSesion = document.getElementById("cerrarSesion");
btnCerrarSesion.onclick = function () {
  localStorage.removeItem("logueado");
  localStorage.removeItem("emailLogged");
  window.location.href = "login.html";
};

var emailUsuario = localStorage.getItem("emailLogged") || "desconocido";

var btnNuevo = document.getElementById("btnNuevoPost");
var overlay = document.getElementById("overlay");
var modalPost = document.getElementById("modalPost");
var btnCancelarPost = document.getElementById("cancelarPost");
var btnPublicarPost = document.getElementById("publicarPost");
var inputTituloPost = document.getElementById("tituloPost");
var inputContenidoPost = document.getElementById("contenidoPost");

var btnSolicitudes = document.getElementById("btnSolicitudes");
var modalSolicitudes = document.getElementById("modalSolicitudes");
var listaSolicitudes = document.getElementById("listaSolicitudes");
var btnCerrarSolicitudes = document.getElementById("cerrarSolicitudes");

function abrirModalPost() {
  overlay.classList.remove("oculto");
  modalPost.classList.remove("oculto");
}

function cerrarModalPost() {
  modalPost.classList.add("oculto");
  inputTituloPost.value = "";
  inputContenidoPost.value = "";
  if (modalSolicitudes.classList.contains("oculto")) {
    overlay.classList.add("oculto");
  }
}

function abrirModalSolicitudes() {
  overlay.classList.remove("oculto");
  modalSolicitudes.classList.remove("oculto");
}

function cerrarModalSolicitudes() {
  modalSolicitudes.classList.add("oculto");
  if (modalPost.classList.contains("oculto")) {
    overlay.classList.add("oculto");
  }
}

btnNuevo.onclick = abrirModalPost;
btnCancelarPost.onclick = cerrarModalPost;
btnSolicitudes.onclick = function () {
  cargarSolicitudes();
};
btnCerrarSolicitudes.onclick = cerrarModalSolicitudes;

overlay.onclick = function () {
  cerrarModalPost();
  cerrarModalSolicitudes();
};

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    cerrarModalPost();
    cerrarModalSolicitudes();
  }
});

btnPublicarPost.onclick = function () {
  var titulo = inputTituloPost.value.trim();
  var contenido = inputContenidoPost.value.trim();

  if (titulo === "" || contenido === "") {
    alert("Completá título y contenido.");
    return;
  }

  var data = {
    autorEmail: emailUsuario,
    titulo: titulo,
    contenido: contenido
  };

  postEvent("crearPosteo", data, function (res) {
    alert(res.msg);
    if (res && res.exito) {
      cerrarModalPost();
      cargarPosteos();
    }
  });
};

function crearHTMLPost(post) {
  var div = document.createElement("div");
  div.className = "post";

  var cantLikes = 0;
  if (Array.isArray(post.likes)) {
    cantLikes = post.likes.length;
  }

  var comentarios = post.comentarios || [];
  var comentariosHTML = "";
  for (var i = 0; i < comentarios.length; i++) {
    var c = comentarios[i];
    var nombreComent = c.autorNombre || c.autor || "Desconocido";
    comentariosHTML += "<p><b>" + nombreComent + "</b>: " + c.texto + "</p>";
  }

  var textoBotonLike = "❤️ " + cantLikes;
  if (Array.isArray(post.likes) && post.likes.indexOf(emailUsuario) !== -1) {
    textoBotonLike = "💔 " + cantLikes;
  }

  var botonSolicitud = "";
  if (post.autorEmail && post.autorEmail !== emailUsuario) {
    botonSolicitud =
      '<button class="btnSolicitud" data-email="' + post.autorEmail + '">Enviar solicitud</button>';
  }

  div.innerHTML =
    "<h3>" + post.titulo + "</h3>" +
    '<p class="meta">por <b>' + (post.autorNombre || "Desconocido") +
    "</b> - <span>" + (post.fecha || "") + "</span></p>" +
    '<p class="textoPost">' + post.contenido + "</p>" +

    '<div class="accionesPost">' +
      '<button class="btnLike" data-id="' + post.id + '">' + textoBotonLike + "</button>" +
      '<input type="text" class="inputComentario" data-id="' + post.id + '" placeholder="Comentar...">' +
      '<button class="btnComentar" data-id="' + post.id + '">Enviar</button>' +
      botonSolicitud +
    "</div>" +

    '<div class="comentarios">' +
      comentariosHTML +
    "</div>";

  return div;
}

function cargarPosteos() {
  postEvent("verPosteos", {}, function (res) {
    var lista = document.getElementById("listaPosteos");
    lista.innerHTML = "";

    if (!res || !res.exito || !res.msg || res.msg.length === 0) {
      lista.innerHTML = "<p>No hay posteos todavía.</p>";
      return;
    }

    for (var i = 0; i < res.msg.length; i++) {
      lista.appendChild(crearHTMLPost(res.msg[i]));
    }

    activarEventosPost();
  });
}

function activarEventosPost() {
  var botonesLike = document.getElementsByClassName("btnLike");
  for (var i = 0; i < botonesLike.length; i++) {
    botonesLike[i].onclick = function () {
      var idPost = Number(this.dataset.id);
      postEvent("darLike", { idPost: idPost, email: emailUsuario }, function (res) {
        cargarPosteos();
      });
    };
  }

  var botonesComentar = document.getElementsByClassName("btnComentar");
  for (var j = 0; j < botonesComentar.length; j++) {
    botonesComentar[j].onclick = function () {
      var idPost = Number(this.dataset.id);
      var input = document.querySelector('.inputComentario[data-id="' + idPost + '"]');
      if (!input) return;

      var texto = input.value.trim();
      if (texto === "") return;

      postEvent(
        "comentarPosteo",
        { idPost: idPost, texto: texto, autorEmail: emailUsuario },
        function (res) {
          cargarPosteos();
        }
      );
    };
  }

  var botonesSolicitud = document.getElementsByClassName("btnSolicitud");
  for (var k = 0; k < botonesSolicitud.length; k++) {
    botonesSolicitud[k].onclick = function () {
      var para = this.dataset.email;
      postEvent(
        "enviarSolicitud",
        { de: emailUsuario, para: para },
        function (res) {
          alert(res.msg);
          cargarSolicitudesContador();
        }
      );
    };
  }
}

var inputBuscar = document.getElementById("buscar");
var btnBuscar = document.getElementById("botonBuscar");

btnBuscar.onclick = function () {
  var texto = inputBuscar.value.trim();

  postEvent("buscarPosteos", { texto: texto }, function (res) {
    var lista = document.getElementById("listaPosteos");
    lista.innerHTML = "";

    if (!res || !res.exito || !res.msg || res.msg.length === 0) {
      lista.innerHTML = "<p>No se encontraron resultados.</p>";
      return;
    }

    for (var i = 0; i < res.msg.length; i++) {
      lista.appendChild(crearHTMLPost(res.msg[i]));
    }
    activarEventosPost();
  });
};

inputBuscar.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    btnBuscar.click();
  }
});

var botonFiltros = document.getElementById("botonFiltros");
var menuFiltros = document.getElementById("menuFiltros");

botonFiltros.onclick = function () {
  menuFiltros.classList.toggle("oculto");
};

document.addEventListener("click", function (e) {
  if (!menuFiltros.contains(e.target) && e.target !== botonFiltros) {
    menuFiltros.classList.add("oculto");
  }
});

var opcionesFiltro = menuFiltros.getElementsByTagName("p");
for (var k = 0; k < opcionesFiltro.length; k++) {
  opcionesFiltro[k].onclick = function () {
    var tipo = this.dataset.filtro;

    postEvent("filtrarPosteos", { tipo: tipo }, function (res) {
      var lista = document.getElementById("listaPosteos");
      lista.innerHTML = "";

      if (!res || !res.exito || !res.msg || res.msg.length === 0) {
        lista.innerHTML = "<p>No hay posteos para ese filtro.</p>";
        return;
      }

      for (var j = 0; j < res.msg.length; j++) {
        lista.appendChild(crearHTMLPost(res.msg[j]));
      }
      activarEventosPost();
      menuFiltros.classList.add("oculto");
    });
  };
}

function cargarSolicitudes() {
  postEvent("verSolicitudes", { email: emailUsuario }, function (res) {
    listaSolicitudes.innerHTML = "";

    if (!res || !res.exito || !res.msg || res.msg.length === 0) {
      listaSolicitudes.innerHTML = "<p>No tenés solicitudes pendientes.</p>";
    } else {
      for (var i = 0; i < res.msg.length; i++) {
        var s = res.msg[i];
        var fila = document.createElement("div");
        fila.className = "solicitud";

        fila.innerHTML =
          "<p><b>" + s.nombreDe + "</b> te envió una solicitud.</p>" +
          '<button class="btnAceptar" data-id="' + s.id + '">Aceptar</button>' +
          '<button class="btnRechazar" data-id="' + s.id + '">Rechazar</button>';

        listaSolicitudes.appendChild(fila);
      }
    }

    abrirModalSolicitudes();

    var botonesAceptar = listaSolicitudes.getElementsByClassName("btnAceptar");
    for (var a = 0; a < botonesAceptar.length; a++) {
      botonesAceptar[a].onclick = function () {
        var idSolicitud = Number(this.dataset.id);
        responderSolicitud(idSolicitud, "aceptar");
      };
    }

    var botonesRechazar = listaSolicitudes.getElementsByClassName("btnRechazar");
    for (var r = 0; r < botonesRechazar.length; r++) {
      botonesRechazar[r].onclick = function () {
        var idSolicitud = Number(this.dataset.id);
        responderSolicitud(idSolicitud, "rechazar");
      };
    }

    cargarSolicitudesContador();
  });
}

function responderSolicitud(idSolicitud, accion) {
  postEvent("responderSolicitud", { idSolicitud: idSolicitud, accion: accion }, function (res) {
    alert(res.msg);
    cargarSolicitudes();
  });
}

function cargarSolicitudesContador() {
  postEvent("verSolicitudes", { email: emailUsuario }, function (res) {
    if (!res || !res.exito || !res.msg) {
      btnSolicitudes.innerText = "Solicitudes";
      return;
    }
    var cant = res.msg.length;
    if (cant > 0) {
      btnSolicitudes.innerText = "Solicitudes (" + cant + ")";
    } else {
      btnSolicitudes.innerText = "Solicitudes";
    }
  });
}

cargarPosteos();
cargarSolicitudesContador();
