import fs from "fs"
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

const form = document.getElementById("registro");
const respuesta = document.getElementById("respuesta");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const contraseña = document.getElementById("contraseña").value;
  const repcontraseña = document.getElementById("repcontraseña").value;
  const edad = document.getElementById("edad").value;
  const instrumento = document.getElementById("instrumento").value;
  const genero = document.getElementById("genero").value;

  if (contraseña !== repcontraseña) {
    respuesta.innerText = "Las contraseñas no coinciden.";
    return;
  }

  const data = {
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
