const searchBar = document.querySelector('.search');
const searchBtn = document.querySelector('button');
const tempBtn = document.querySelector('.tempBtn');
const celsius = document.querySelector('.celsius');
const farenheit = document.querySelector('.farenheit');
let tempUnit = 'farenheit';
const h1 = document.querySelector('h1');
const h2 = document.querySelector('h2');
const high = document.querySelector('.high');
const low = document.querySelector('.low');
const feels = document.querySelector('.feels');
const cloudySpan = document.querySelector('.condition');
let condition;
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const errorSpan = document.querySelector('.error');

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    async function getCoords() {
        errorSpan.textContent = "";
        checkUnit();
        const city = searchBar.value;
        h1.textContent = formatCityName(city);

        const response = await fetch(('https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=d4b50f221b557e648860040cd6779c38&units=' + tempUnit), {mode: 'cors'});
        const coordsData = await response.json();
        const lat = coordsData[0].lat;
        const lon = coordsData[0].lon;
        const response1 = await fetch(('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=d4b50f221b557e648860040cd6779c38&units=' + tempUnit), {mode: 'cors'});
        const cityData = await response1.json();

        console.log(cityData);
        appendData(cityData);
    }
    getCoords().catch((err) => {
        console.log(err);
        errorSpan.textContent = "Error: The city entered is either too small or was misspelled. Please try again."
    });
});

tempBtn.addEventListener('click', () => {
    celsius.classList.toggle('bold');
    farenheit.classList.toggle('bold');
    getCoords();
});

function checkUnit() {
    const tempUnitElem = document.querySelector('.bold');
    if (tempUnitElem.classList.contains('celsius')) {
        tempUnit = 'metric';
    } else {
        tempUnit = 'imperial';
    }
    return tempUnit;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function formatCityName(cityName) {
    const words = cityName.split(" ");
    for (let i=0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    words.join("");
    const formattedCityName = words.toString().replace(/,/g, ' ');
    return formattedCityName;
}

function getClouds(data) {
    const clouds = data.clouds.all;
    if (clouds > 75) {
        condition = 'Cloudy'
    } else if (clouds > 40 && clouds < 75) {
        condition = 'Mostly Cloudy'
    } else if (clouds > 20 && clouds < 40) {
        condition = 'Partly Cloudy'
    } else {
        condition = 'Clear Skies'
    }
    return condition;
}

function appendData(data) {
    cloudySpan.textContent = getClouds(data);
    h2.textContent = `${Math.round(data.main.temp)}°`;
    high.textContent = `H: ${Math.round(data.main.temp_max)}°`;
    low.textContent = `L: ${Math.round(data.main.temp_min)}°`;
    feels.textContent = `Feels Like: ${Math.round(data.main.feels_like)}°`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind: ${data.wind.speed} MPH`;
} 