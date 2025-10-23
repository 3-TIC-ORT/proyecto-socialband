let form = document.getElementById("registro");
let respuesta = document.getElementById("respuesta");

function obtenerDatos() {
  let nombre = document.getElementById("nombre").value;
  let email = document.getElementById("email").value;
  let contraseña = document.getElementById("contraseña").value;
  let repcontraseña = document.getElementById("repcontraseña").value;
  let edad = document.getElementById("edad").value;
  let instrumento = document.getElementById("instrumento").value;
  let genero = document.getElementById("genero").value;

  let datos = {
    nombre: nombre,
    email: email,
    contraseña: contraseña,
    repcontraseña: repcontraseña,
    edad: edad,
    instrumento: instrumento,
    genero: genero
  };

  return datos;
}

function mostrarMensaje(texto) {
  respuesta.innerText = texto;
}

function registrarUsuario(datos) {
  if (datos.contraseña === datos.repcontraseña) {
    mostrarMensaje("Cuenta creada con exito");
    setTimeout(function() {
      window.location.href = "login.html";
    }, 1000);
  } else {
    mostrarMensaje("Las contraseñas no coinciden");
  }
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  let datos = obtenerDatos();
  registrarUsuario(datos);
});
