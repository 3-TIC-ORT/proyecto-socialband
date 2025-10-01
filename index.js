import fs from "fs"
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import fs from "fs";
import { subscribePOSTEvent, startServer } from "soquetic";

const usuariosFile = "./usuarios.json";

function leerUsuarios() {
  const data = fs.readFileSync(usuariosFile, "utf-8");
  return JSON.parse(data);
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(usuariosFile, JSON.stringify(usuarios, null, 2));
}

subscribePOSTEvent("registroUsuario", (data) => {
  console.log("Datos recibidos del registro:", data);

  const usuarios = leerUsuarios();

  usuarios.push({
    nombre: data.nombre,
    email: data.email,
    contraseña: data.contraseña,
    edad: data.edad,
    instrumento: data.instrumento,
    genero: data.genero,
  });

  guardarUsuarios(usuarios);

  return {
    msg: `Usuario ${data.nombre} registrado correctamente.`,
  };
});

startServer(3000);
