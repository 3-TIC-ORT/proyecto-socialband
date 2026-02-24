connect2Server();


let inputEmail = document.getElementById("email");
let inputPass = document.getElementById("password");
let btnEntrar = document.getElementById("entrar");
let mensaje = document.getElementById("mensaje");

const modal = document.getElementById("modalLogin");
const btnCerrar = document.getElementById("cerrarModal");
const btnAbrirLogin = document.getElementById("btnAbrirLogin");
const btnIrRegistro = document.getElementById("btnIrRegistro");
const overlay = document.getElementById("overlayLogin");

function mostrarMensajeLogin(texto, color) {
  mensaje.innerText = texto;
  if (color) mensaje.style.color = color;
}

function cerrarModal() {
 
  modal.classList.add("oculto");
  modal.style.display = "none";

  if (overlay) {
    overlay.style.display = "none";
    overlay.style.pointerEvents = "none";
  }
}

function abrirModal() {
  modal.classList.remove("oculto");
  modal.style.display = "block";

  modal.style.zIndex = "9999";
  modal.style.pointerEvents = "auto";

  if (overlay) {
    overlay.style.display = "block";
    overlay.style.zIndex = "9998";
    overlay.style.pointerEvents = "auto";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  cerrarModal();

  if (btnAbrirLogin) {
    btnAbrirLogin.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      abrirModal();
    });
  }

  if (btnCerrar) {
    btnCerrar.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      cerrarModal();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      cerrarModal();
    });
  }

  if (btnIrRegistro) {
    btnIrRegistro.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "registro.html";
    });
  }
});

btnEntrar.addEventListener("click", function () {
  let email = inputEmail.value.trim();
  let contraseña = inputPass.value;

  if (email === "" || contraseña === "") {
    mostrarMensajeLogin("Completá ambos campos.", "orange");
    return;
  }

  let datosLogin = { email: email, contraseña: contraseña };

  postEvent("loginUsuario", datosLogin, function (res) {
    if (res && res.exito) {
      mostrarMensajeLogin(res.msg, "green");

      localStorage.setItem("logueado", "true");
      localStorage.setItem("emailLogged", email);

      let usuario = { email: email, contraseña: contraseña };
      localStorage.setItem("usuario", JSON.stringify(usuario));

      setTimeout(() => {
        window.location.href = "home.html";
      }, 700);
    } else {
      mostrarMensajeLogin(
        (res && res.msg) ? res.msg : "Correo o contraseña incorrectos.",
        "red"
      );
    }
  });
});