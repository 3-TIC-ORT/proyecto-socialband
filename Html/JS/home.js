if (localStorage.getItem("logueado") !== "true") {
  window.location.href = "login.html";
}

let botonBuscar = document.querySelector('input[type="submit"]');
let inputBuscar = document.getElementById('buscar');

botonBuscar.addEventListener('click', (e) => {
  e.preventDefault(); 
  let texto = inputBuscar.value.trim();
  if (texto === '') {
    alert('Escribí algo para buscar');
  } else {
    alert('Buscaste: ' + texto);
  }
});
