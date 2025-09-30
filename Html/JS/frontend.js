import fs from "fs"
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
const form = document.getElementById("registro");
const respuesta = document.getElementById("respuesta");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = {
    nombre,
    email,
    password,
  };

  postEvent("registroUsuario", data, (respuestaServidor) => {
    respuesta.innerText = respuestaServidor.msg;
  });

  form.reset(); 
});