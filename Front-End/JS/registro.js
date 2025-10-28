connect2Server();

let form = document.getElementById("registro");
let respuesta = document.getElementById("respuesta");

function obtenerDatos() {
  let nombre = document.getElementById("nombre").value.trim();
  let email = document.getElementById("email").value.trim();
  let contraseña = document.getElementById("contraseña").value;
  let repcontraseña = document.getElementById("repcontraseña").value;
  let edad = document.getElementById("edad").value.trim();
  let instrumento = document.getElementById("instrumento").value.trim();
  let genero = document.getElementById("genero").value.trim();

  return {
    nombre: nombre,
    email: email,
    contraseña: contraseña,
    repcontraseña: repcontraseña,
    edad: edad,
    instrumento: instrumento,
    genero: genero
  };
}

function mostrarMensaje(texto, color) {
  respuesta.innerText = texto;
  if (color) respuesta.style.color = color;
}

function registrarUsuario(datos) {
  if (datos.contraseña !== datos.repcontraseña) {
    mostrarMensaje("Las contraseñas no coinciden.", "red");
    return;
  }
  postEvent("registroUsuario", datos, function(res) {
    if (res && res.exito) {
      mostrarMensaje(res.msg, "green");
      setTimeout(function() {
        window.location.href = "login.html";
      }, 1000);
    } else {
    
      mostrarMensaje((res && res.msg) ? res.msg : "Error al registrar.", "red");
    }
  });
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  let datos = obtenerDatos();

  if (!datos.nombre || !datos.email || !datos.contraseña || !datos.repcontraseña) {
    mostrarMensaje("Completá los campos obligatorios.", "orange");
    return;
  }

  registrarUsuario(datos);
});
