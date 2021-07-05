// selectors
const year = document.querySelector('#year');
const form = document.querySelector('#form');
const countrySelect = document.querySelector('#country');
const resultContainer = document.querySelector('#result-container');

class API {

    async consultCountryAPI(region) {
        try {
            const url = `https://restcountries.eu/rest/v2/region/${region}`;

            const response = await fetch(url);
            const result = response.json();

            return result;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    async consultWeatherAPI(city, country) {
        ui.spinner();// show the spinner

        try {
            const appID = '';
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${appID}`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            if(result) {
                ui.cleanHTML();
                if(result.cod === '404') {
                    ui.printAlert('City not found', 'error');
                    return;
                }
                ui.printWeather(result);
            }
            
        } catch (error) {
            console.log(error);
        }
    }
}

class UI {

    printAlert(message, type) {
        const alert = document.createElement('div');
        alert.classList.add('w-100','alert', 'text-center');

        if(type === 'error') {
            alert.classList.add('alert-danger');
        } else {
            alert.classList.add('alert-success');
        }
        alert.textContent = message;

        resultContainer.appendChild(alert);
    }

    printWeather(datas) {
        const { 
            name,
            main: { temp, temp_max, temp_min}
        } = datas

        const centigrade = kelvinToCentigrade(temp);
        const max = kelvinToCentigrade(temp_max);
        const min = kelvinToCentigrade(temp_min);

        const cityName = document.createElement('p');
        cityName.textContent = `Weather in ${name}`;
        cityName.classList.add('fs-4', 'fw-bold');

        const currentTemp = document.createElement('p');
        currentTemp.innerHTML = `${centigrade} &#8451;`;
        currentTemp.classList.add('fs-2','fw-bold');

        const maxTemp = document.createElement('p');
        maxTemp.innerHTML = `Max: ${max} &#8451;`;
        maxTemp.classList.add('fs-3');

        const minTemp = document.createElement('p');
        minTemp.innerHTML = `Min: ${min} &#8451;`;
        minTemp.classList.add('fs-3');

        resultContainer.appendChild(cityName);
        resultContainer.appendChild(currentTemp);
        resultContainer.appendChild(maxTemp);
        resultContainer.appendChild(minTemp);
    }

    spinner() {
        this.cleanHTML();
    
        const spinnerDiv = document.createElement('div');
        spinnerDiv.classList.add('spinner');

        spinnerDiv.innerHTML = `
            <div class="double-bounce1"></div>
            <div class="double-bounce2"></div>
        `;

        resultContainer.appendChild(spinnerDiv);
    }

    cleanHTML() {
        while(resultContainer.firstChild) {
            resultContainer.removeChild(resultContainer.firstChild);
        }
    }
}

const api = new API();
const ui = new UI();

addEventListeners();

// functions
function addEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
        downloadSelect();
        currentYear();
    });

    form.addEventListener('submit', showWeather);
}

async function downloadSelect() {
    const countries = await api.consultCountryAPI('americas');

    countries.forEach(country => {
        let option = document.createElement('option');
        option.textContent = country.name;
        option.setAttribute('value', country.alpha2Code);
        
        countrySelect.appendChild(option);
    });
}

async function showWeather(e) {
    e.preventDefault();
    const city = document.querySelector('#city').value;
    const country = document.querySelector('#country').value;

    await api.consultWeatherAPI(city, country);
}

function kelvinToCentigrade(grade) {
    return parseInt(grade - 273.15);
}

function currentYear() {
    let date = new Date();
    year.textContent = date.getFullYear();
}