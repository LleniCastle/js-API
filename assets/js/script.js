let valueInput = document.querySelector("#input");
let valueSelect = document.querySelector("#select");
let result = document.querySelector(".result");
let button = document.querySelector("#button");
let graphic = document.querySelector(".graphic");
const apiURL = "https://mindicador.cl/api/";

button.addEventListener('click', () => {
    let value = Number(valueSelect.value);
    if (value == isNaN || value == '0') {
        alert('Por favor, ingrese informacion para realizar el cambio.');
    } else {
        getCoins();
    }
});

async function getCoins() {
    try {
        let calculo = 0;
        const res = await fetch(apiURL);
        const coins = await res.json();
        const valueCoins = [coins['dolar']['valor'], coins['euro']['valor'], coins['uf']['valor']];
        if (valueInput.value === "" || valueInput.value < 1) {
            alert("Por favor, ingrese un valor en pesos correcto")
        } else if (valueSelect.value == 'dolar') {
            calculo = valueInput.value / valueCoins[0];
            result.innerHTML = `<p>Resultado: US$${calculo.toFixed(2).replace('.', ',')}</p>`
            render(valueSelect.value);
        } else if (valueSelect.value == 'euro') {
            calculo = valueInput.value / valueCoins[1];
            result.innerHTML = `<p>Resultado: ${calculo.toFixed(2).replace('.', ',')}€</p>`
            render(valueSelect.value);
        } else if (valueSelect.value == 'uf') {
            calculo = valueInput.value / valueCoins[2];
            result.innerHTML = `<p>Resultado: ${calculo.toFixed(2).replace('.', ',')} UF</p>`
            render(valueSelect.value);
        }
    }
    catch (error) {
        console.error('Ha ocurrido un error:', error);
        alert('Se ha producido un error al obtener el historial del valor de la moneda');
    }
}

async function getAndCreateDataToChart(mindicador) {
    const res = await fetch(apiURL + mindicador);
    const valor = await res.json();

    const labels = valor['serie'].slice(0, 10).reverse().map((fechaActual) => {
        return fechaActual['fecha'].slice(0, 10).split('-').reverse().join('-');
    });
    const data = valor['serie'].slice(0, 10).reverse().map((valorActual) => {
        return Number(valorActual['valor']);
    });
    const datasets = [
        {
            label: `El valor del ${mindicador} últimos 10 días`,
            width: '500px;',
            borderColor: 'turquoise',
            fontSize: '50px;',
            data
        }
    ];

    return { labels, datasets }
}

async function render(mindicador) {
    const data = await getAndCreateDataToChart(mindicador);
    const config = {
        type: "line",
        data
    };
    let myChart = document.querySelector("#myChart");
    myChart.style.backgroundColor = "white";
    new Chart(myChart, config);
}

render(valueSelect.value);

//revisar porque sale fecha al buscar y revisar validacion cuando no se agrega selectvalue/ revisar catch