connect2Server(); 

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

  return {
    nombre,
    email,
    contraseña,
    repcontraseña,
    edad,
    instrumento,
    genero
  };
}

function mostrarMensaje(texto) {
  respuesta.innerText = texto;
}

function registrarUsuario(datos) {
  if (datos.contraseña !== datos.repcontraseña) {
    mostrarMensaje("Las contraseñas no coinciden");
    return;
  }

  postEvent("registroUsuario", datos, (respuestaServidor) => {
    if (respuestaServidor?.ok) {
      mostrarMensaje("Cuenta creada con éxito");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    } else {
      mostrarMensaje(respuestaServidor?.mensaje || "Error al registrar usuario");
    }
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let datos = obtenerDatos();
  registrarUsuario(datos);
});
