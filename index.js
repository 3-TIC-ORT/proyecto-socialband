import fs from "fs"
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
subscribePOSTEvent("registroUsuario", (data) => {
    console.log("Datos recibidos del registro:", data);
    return {
      msg: `Usuario ${data.nombre} registrado correctamente.`,
    };
  });
  
  startServer(3000);
  