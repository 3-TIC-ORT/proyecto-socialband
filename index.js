import fs from "fs"
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

// Registro
function leerUsuarios() {
  const data = fs.readFileSync("./usuarios.json", "utf-8");
  return JSON.parse(data);
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync("./usuarios.json", JSON.stringify(usuarios, null, 2));
}

subscribePOSTEvent("registroUsuario", (data) => {
  const usuarios = leerUsuarios();

  if (usuarios.find(u => u.email === data.email)) {
    return { msg: "Correo ya registrado.", exito: false };
  }

  usuarios.push(data);
  guardarUsuarios(usuarios);

  return { msg: `Usuario ${data.nombre} registrado.`, exito: true };
});

// Inicio de sesión

subscribePOSTEvent("loginUsuario", (data) => {
  const usuarios = leerUsuarios();

  const user = usuarios.find(u => u.email === data.email && u.contraseña === data.password);

  if (user) {
    return { msg: `Bienvenido ${user.nombre}`, exito: true };
  }
  return { msg: "Correo o contraseña incorrectos.", exito: false };
});

startServer(3000);
