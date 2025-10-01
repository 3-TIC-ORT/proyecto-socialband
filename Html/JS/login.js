import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import { postEvent } from "soquetic"; 
const form = document.getElementById("login");
const respuesta = document.getElementById("respuesta");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const data = { email, password };

  postEvent("loginUsuario", data, (res) => {
    respuesta.innerText = res.msg;
    if (res.exito) {
      console.log("Login exitoso");
      window.location.href = "home.html";
    } else {
      console.log("Login fallido");
    }
  });

  form.reset();
});