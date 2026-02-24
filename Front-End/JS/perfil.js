connect2Server();

let nombre = document.getElementById("nombre");
let edad = document.getElementById("edad");
let genero = document.getElementById("genero");
let instrumento = document.getElementById("instrumento");
let generoMusical = document.getElementById("generoMusical");

let btnGuardar = document.getElementById("btnguardar");
let btnDescartar = document.getElementById("btndescartar");
let btnVolver = document.getElementById("btnVolver");

window.addEventListener("DOMContentLoaded", () => {
  let usuarioGuardado = localStorage.getItem("usuario");
  if (!usuarioGuardado) {
    alert("No hay usuario cargado. Iniciá sesión primero.");
    window.location.href = "login.html";
    return;
  }

  let user = JSON.parse(usuarioGuardado);

  postEvent("verPerfil", { email: user.email }, (res) => {
    if (res && res.exito && res.msg) {
      let datos = res.msg;
      nombre.value = datos.nombre || "";
      edad.value = datos.edad || "";
      genero.value = datos.genero || "";
      instrumento.value = datos.instrumento || "";
      generoMusical.value = datos.generoMusical || "";
    } else {
      alert("No se pudieron cargar los datos del perfil.");
    }
  });
});

btnGuardar.addEventListener("click", () => {
  let usuarioGuardado = localStorage.getItem("usuario");
  if (!usuarioGuardado) {
    alert("No hay usuario cargado.");
    return;
  }

  let user = JSON.parse(usuarioGuardado);

  let nuevosDatos = {
    email: user.email,
    nombre: nombre.value.trim(),
    edad: edad.value.trim(),
    genero: genero.value.trim(),
    instrumento: instrumento.value.trim(),
    generoMusical: generoMusical.value.trim(),
    contraseña: user.contraseña
  };

  postEvent("guardarPerfil", nuevosDatos, (res) => {
    if (res && res.exito) {
      alert("Cambios guardados correctamente.");
      localStorage.setItem("usuario", JSON.stringify(nuevosDatos));
    } else {
      alert("Error al guardar los cambios.");
    }
  });
});

btnDescartar.addEventListener("click", () => {
  window.location.reload();
});

btnVolver.addEventListener("click", () => {
  window.location.href = "home.html";
});