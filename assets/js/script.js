const inputMonto = document.getElementById('monto');
const selectMoneda = document.getElementById('moneda');
const btnBuscar = document.getElementById('btnBuscar');
const pResultado = document.getElementById('resultado');
const pError = document.getElementById('error');
const chartContainer = document.getElementById('chartContainer');

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

            chartContainer.classList.add('hidden');
            if (window.chart) {
                window.chart.destroy();
                window.chart = null;
            }
            return;
        } 

        chartContainer.classList.remove('hidden');

        const res = await fetch(`https://mindicador.cl/api/${codigoMoneda}`);
        const data = await res.json();
        const valorMoneda = data.serie[0].valor;

        const resultado = montoPesos / valorMoneda

        pResultado.textContent = `$${montoPesos.toLocaleString('es-CL')} pesos chilenos son aproximadamente ${resultado.toFixed(2)} ${codigoMoneda}`

        // Renderizar la grafica (ultimos 20 dias)
        const fechasMoneda = data.serie.slice(0, 20).map(item =>{
            return new Date(item.fecha).toLocaleDateString('es-CL');
        }).reverse();
        const valores = data.serie.slice(0, 20).map(item => item.valor).reverse();

        const ctx = document.getElementById('myChart');
        if (!ctx) return;

        if (window.chart) {
            window.chart.destroy();
        }

        window.chart = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: fechasMoneda,
                datasets: [{
                   label: `Valor histórico del ${codigoMoneda}`,
                  data: valores,
                  borderColor: '#3B82F6',
                  tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                    beginAtZero: false
                    }
                }
            }
        });
        } catch (error) {
            pResultado.textContent = '';
            pError.textContent = 'Ocurrió un error al realizar la conversión';

            chartContainer.classList.add('hidden');
            if(window.chart) {
                window.chart.destroy();
                window.chart = null;
            }
            console.log(error)
            }
        };

getMonedas();

btnBuscar.addEventListener('click', convertirMoneda);

