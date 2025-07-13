const inputMonto = document.getElementById('monto');
const selectMoneda = document.getElementById('moneda');
const btnBuscar = document.getElementById('btnBuscar');
const pResultado = document.getElementById('resultado');

const baseUrl = 'https://mindicador.cl/api/';

async function getMonedas() {
    try {
        const res = await fetch (baseUrl);
        const monedas = await res.json();
        const monedasPermitidas = ['dolar', 'uf','utm'];
        monedasPermitidas.forEach(codigo => {
            const moneda = monedas[codigo];
            const option = document.createElement('option');
            option.value = codigo;
            option.textContent = moneda.nombre;
            selectMoneda.appendChild(option)
        });
    } catch (error) {
        console.log(error);
    } 
}

getMonedas();