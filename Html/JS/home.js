let botonBuscar = document.querySelector('input[type="submit"]');
let inputBuscar = document.getElementById('buscar');

botonBuscar.addEventListener('click', () => {
  let texto = inputBuscar.value.trim();
  if (texto === '') {
    alert('Escribí algo para buscar');
  } else {
    alert('Buscaste: ' + texto);
  }
});