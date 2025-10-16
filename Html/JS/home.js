const botonBuscar = document.querySelector('input[type="submit"]');
const inputBuscar = document.getElementById('buscar');

botonBuscar.addEventListener('click', () => {
  const texto = inputBuscar.value.trim();
  if (texto === '') {
    alert('Escribí algo para buscar');
  } else {
    alert('Buscaste: ' + texto);
  }
});