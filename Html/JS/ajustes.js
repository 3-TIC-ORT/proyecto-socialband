const modoClaro = document.getElementById("modoClaro");
const modoOscuro = document.getElementById("modoOscuro");
const brillo = document.getElementById("brillo");

modoClaro.addEventListener("click", () => {
document.body.style.backgroundColor = "white";
document.body.style.color = "black";
});
modoOscuro.addEventListener("click", () => {
document.body.style.backgroundColor = "black";
document.body.style.color = "white";
    });
brillo.addEventListener("input", () => {
let valor = brillo.value / 100;
document.body.style.filter =`brightness(${valor})`;
    });        
