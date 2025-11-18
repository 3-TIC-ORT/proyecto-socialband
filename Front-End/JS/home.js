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
var modal = document.getElementById("modalPost");
var btnCancelar = document.getElementById("cancelarPost");
var btnPublicar = document.getElementById("publicarPost");
var inputTituloPost = document.getElementById("tituloPost");
var inputContenidoPost = document.getElementById("contenidoPost");

function abrirModal() {
  overlay.classList.remove("oculto");
  modal.classList.remove("oculto");
}

function cerrarModal() {
  overlay.classList.add("oculto");
  modal.classList.add("oculto");
  inputTituloPost.value = "";
  inputContenidoPost.value = "";
}

btnNuevo.onclick = abrirModal;
btnCancelar.onclick = cerrarModal;
overlay.onclick = cerrarModal;

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    cerrarModal();
  }
});

btnPublicar.onclick = function () {
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
      cerrarModal();
      cargarPosteos();
    }
  });
};
function crearHTMLPost(post) {
  var div = document.createElement("div");
  div.className = "post";

  var cantLikes = post.likes || 0;
  var comentarios = post.comentarios || [];

  var comentariosHTML = "";
  for (var i = 0; i < comentarios.length; i++) {
    var c = comentarios[i];
    comentariosHTML += "<p><b>" + c.autor + "</b>: " + c.texto + "</p>";
  }

  div.innerHTML =
    "<h3>" + post.titulo + "</h3>" +
    '<p class="meta">por <b>' + (post.autorNombre || "Desconocido") +
    "</b> - <span>" + (post.fecha || "") + "</span></p>" +
    '<p class="textoPost">' + post.contenido + "</p>" +

    '<div class="accionesPost">' +
      '<button class="btnLike" data-id="' + post.id + '">❤️ ' + cantLikes + "</button>" +
      '<input type="text" class="inputComentario" data-id="' + post.id + '" placeholder="Comentar...">' +
      '<button class="btnComentar" data-id="' + post.id + '">Enviar</button>' +
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
      postEvent("darLike", { idPost: idPost }, function (res) {
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
          input.value = "";
          cargarPosteos();
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

cargarPosteos();
