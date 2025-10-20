import fs from "fs"
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

let form = document.getElementById("registro");
let respuesta = document.getElementById("respuesta");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let nombre = document.getElementById("nombre").value;
  let email = document.getElementById("email").value;
  let contraseña = document.getElementById("contraseña").value;
  let repcontraseña = document.getElementById("repcontraseña").value;
  let edad = document.getElementById("edad").value;
  let instrumento = document.getElementById("instrumento").value;
  let genero = document.getElementById("genero").value;

  if (contraseña !== repcontraseña) {
    respuesta.innerText = "Las contraseñas no coinciden.";
    return;
  }

  let data = {
    nombre,
    email,
    contraseña,
    edad,
    instrumento,
    genero,
  };

  postEvent("registroUsuario", data, (respuestaServidor) => {
    respuesta.innerText = respuestaServidor.msg;
  });

  form.reset();
});
