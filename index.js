import fs from "fs"
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

const usuariosFile = "./usuarios.json";

function leerUsuarios() {
  const data = fs.readFileSync(usuariosFile, "utf-8");
  return JSON.parse(data);
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(usuariosFile, JSON.stringify(usuarios, null, 2));
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

subscribePOSTEvent("loginUsuario", (data) => {
  const usuarios = leerUsuarios();

  const user = usuarios.find(u => u.email === data.email && u.contraseña === data.password);

  if (user) {
    return { msg: `Bienvenido ${user.nombre}`, exito: true };
  }
  return { msg: "Correo o contraseña incorrectos.", exito: false };
});

startServer(3000);
