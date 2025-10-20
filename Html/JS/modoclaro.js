window.addEventListener("DOMContentLoaded", () => {
    let modo = localStorage.getItem("modo") || "claro";
    let brillo = localStorage.getItem("brillo") || 100;
  
    aplicarModo(modo);
    document.body.style.filter = `brightness(${brillo}%)`;
  });
  
  function aplicarModo(modo) {
    if (modo === "oscuro") {
      document.body.style.backgroundColor = "#1e1e1e";
      document.body.style.color = "#ffffff";
    } else {
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#000000";
    }
  }
  