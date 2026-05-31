let tempCelsius = null;
let emFahrenheit = false;

document.getElementById('btnConverter').addEventListener('click', () => {
    emFahrenheit = !emFahrenheit;
    const temp = emFahrenheit 
        ? Math.round(tempCelsius * 9/5 + 32) 
        : Math.round(tempCelsius);
    const unidade = emFahrenheit ? '°F' : '°C';
    document.getElementById('tempExibida').textContent = `${temp}${unidade}`;
});
const historicoCidades = [];
function atualizarHora() {
    const agora = new Date();
    const opcoes = { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long',
        hour: '2-digit', 
        minute: '2-digit'
    };
    const texto = agora.toLocaleDateString('pt-BR', opcoes);
    document.getElementById('dataHora').textContent = texto;
}

atualizarHora();
setInterval(atualizarHora, 1000);
const botao = document.getElementById("buscar");
const resultado = document.getElementById("resultado");

botao.addEventListener("click", buscarClima);

async function buscarClima() {

    const cidade = document.getElementById("cidade").value;
if (!historicoCidades.includes(cidade)) {
    historicoCidades.push(cidade);
    atualizarHistorico();
}
    if (cidade === "") {

        resultado.innerHTML = `
            <p>Digite uma cidade.</p>
        `;

        return;
    }

    const chaveApi = "71abb697a13e975535ca34a42d3ceb62";

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chaveApi}&units=metric&lang=pt_br`;

    try {

        const resposta = await fetch(url);

        const dados = await resposta.json();

        if (dados.cod == "404") {

            resultado.innerHTML = `
                <p>Cidade não encontrada.</p>
            `;

            return;
        }
 const icone = dados.weather[0].icon;

const emojis = {
  "01d": "☀️", "01n": "🌙",
  "02d": "⛅", "02n": "⛅",
  "03d": "☁️", "03n": "☁️",
  "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️",
  "10d": "🌦️", "10n": "🌧",
  "11d": "⛈️", "11n": "⛈️",
  "13d": "❄️", "13n": "❄️",
  "50d": "🌫️", "50n": "🌫️"
};

const simbolo = emojis[icone] || "🌡️";

resultado.innerHTML = `
    <h2>${simbolo} ${dados.name}</h2>
    <p><strong>🌡️ Temperatura:</strong> <span id="tempExibida">${Math.round(dados.main.temp)}°C</span></p>
    <p><strong>🥵 Sensação:</strong> ${Math.round(dados.main.feels_like)}°C</p>
    <p><strong>💧 Umidade:</strong> ${dados.main.humidity}%</p>
    <p><strong>💨 Vento:</strong> ${dados.wind.speed} km/h</p>
    <p><strong>🌤️ Clima:</strong> ${dados.weather[0].description}</p>
`;
tempCelsius = dados.main.temp;
emFahrenheit = false;
document.getElementById('btnConverter').style.display = 'inline-block';
} catch (erro) {
        resultado.innerHTML = `
            <p>Erro ao consultar a API.</p>
        `;

        console.log(erro);
    }
}
function atualizarHistorico() {
    const div = document.getElementById('historico');
    div.innerHTML = '<p><strong>🕐 Últimas buscas:</strong></p>' +
        historicoCidades.map(c => 
            `<span onclick="buscarPorHistorico('${c}')">${c}</span>`
        ).join('');
}

function buscarPorHistorico(cidade) {
    document.getElementById('cidade').value = cidade;
    buscarClima();
}