const inputMonto = document.getElementById('monto');
const selectMoneda = document.getElementById('moneda');
const btnBuscar = document.getElementById('btnBuscar');
const pResultado = document.getElementById('resultado');
const pError = document.getElementById('error');

const baseUrl = 'https://mindicador.cl/api/';

//funcion para renderizar el nombre de las monedas
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

//Funcion para la conversion de monedas

async function convertirMoneda () {
    try {
        const montoPesos = Number(inputMonto.value);
        const codigoMoneda = selectMoneda.value;

        pResultado.textContent = '';
        pError.textContent = '';

        if(!codigoMoneda) {
            pError.textContent = 'Por favor seleccione una moneda';
            pResultado.textContent = '';
            return
        } 

        const res = await fetch(`https://mindicador.cl/api/${codigoMoneda}`);
        const data = await res.json();
        const valorMoneda = data.serie[0].valor;

        const resultado = montoPesos / valorMoneda

        pResultado.textContent = `$${montoPesos.toLocaleString('es-CL')} pesos chilenos son aproximadamente ${resultado.toFixed(2)} ${codigoMoneda}`

    } catch (error) {
        pResultado.textContent = '';
        pError.textContent = 'Ocurrió un error al realizar la conversión';
        console.log(error)
    }

}

getMonedas();

btnBuscar.addEventListener('click', convertirMoneda);

