
deg = '°C';
const csvData = `
latitude,longitude,city,country
52.367,4.904,Amsterdam,Netherlands
39.933,32.859,Ankara,Turkey
56.134,12.945,Åstorp,Sweden
37.983,23.727,Athens,Greece
54.597,-5.930,Belfast,Northern Ireland
41.387,2.168,Barcelona,Spain
52.520,13.405,Berlin,Germany
46.948,7.447,Bern,Switzerland
43.263,-2.935,Bilbao,Spain
50.847,4.357,Brussels,Belgium
47.497,19.040,Bucharest,Romania
59.329,18.068,Budapest,Hungary
51.483,-3.168,Cardiff,Wales
50.937,6.96,Cologne,Germany
55.676,12.568,Copenhagen,Denmark
51.898,-8.475,Cork,Ireland
53.349,-6.260,Dublin,Ireland
55.953,-3.188,Edinburgh,Scotland
43.7696,11.255,Florence,Italy
50.110,8.682,Frankfurt,Germany        
43.254,6.637,French Riviera,France
32.650,-16.908,Funchal,Portugual
36.140,-5.353,Gibraltar
57.708,11.974,Gothenburg,Sweden     
53.548,9.987,Hamburg,Germany
60.169,24.938,Helsinki,Finland
39.020,1.482,Ibiza,Spain
50.450,30.523,Kyiv,Ukraine
61.115,10.466,Lillehammer,Norway
38.722,-9.139,Lisbon,Portugual
51.507,-0.127,London,England      
40.416,-3.703,Madrid,Spain
39.695,3.017,Mallorca,Spain
53.480,-2.242,Manchester,England       
43.296,5.369,Marseille,France
27.760,-15.586,Maspalomas,Spain
45.464,9.190,Milan,Italy
48.135,11.582,Munich,Germany
40.851,14.268,Naples,Italy
43.034,-2.417,Oñati,Spain
59.913,10.752,Oslo,Norway
48.856,2.352,Paris,France
50.075,14.437,Prague,Czech Republic
64.146,-21.942,Reykjavík,Iceland
56.879,24.603,Riga,Latvia
41.902,12.496,Rome,Italy
39.453,-31.127,Santa Cruz das Flores,Portugual
28.463,-16.251,Santa Cruz de Tenerife,Spain
57.273,-6.215,Skye,Scotland
42.697,23.321,Sofia,Bulgaria
59.329,18.068,Stockholm,Sweden
59.437,24.753,Tallinn,Estonia
18.208,16.373,Vienna,Austria
52.229,21.012,Warsaw,Poland
53.961,-1.07,York,England
47.376,8.541,Zurich,Switzerland
`;



const results = Papa.parse(csvData.trim(), {header: true});
const select = document.getElementById('city-select');
// Supprimez toutes les options existantes
select.innerHTML = '';
// Ajoutez une option par défaut
const defaultOption = document.createElement('option');
defaultOption.text = '-- select a city --';
select.add(defaultOption);
// Ajoutez une option pour chaque ligne du fichier CSV
results.data.forEach(function(row) {
    if (row.city && row.country) {
        const option = document.createElement('option');
        option.text = row.city + ', ' + row.country;
        option.value = JSON.stringify({city: row.city.toLowerCase(), lat: row.latitude, lon: row.longitude});
        select.add(option);
    }
});

let isCelsius = true;

function displayCity() {
    const cityDisplay = document.getElementById('city-display');
    const selectedCity = JSON.parse(document.getElementById('city-select').value);
    if (selectedCity.city) {
        fetch(`http://www.7timer.info/bin/api.pl?lon=${selectedCity.lon}&lat=${selectedCity.lat}&product=civillight&output=json`)
            .then(response => response.json())
            .then(data => {
                cityDisplay.innerHTML = '';
                data.dataseries.slice(0, 7).forEach(dayData => {
                    const dayDiv = document.createElement('div');
                    dayDiv.style.textAlign = "center";
                    dayDiv.style.display = "flex";
                    dayDiv.style.flexDirection = "column";
                    dayDiv.style.justifyContent = "center";
                    dayDiv.classList.add("weather-card");
                    
                    let weatherIcon;
                    switch(dayData.weather){
                        case "clear":
                            weatherIcon="clear.png";
                            break;
                        case "cloudy":
                            weatherIcon="cloudy.png";
                            break;
                        case "fog":
                            weatherIcon="fog.png";
                            break;
                        case "humid":
                            weatherIcon="humid.png";
                            break;
                        case "ishower":
                            weatherIcon="ishower.png";
                            break;
                        case "lightrain":
                            weatherIcon="lightrain.png";
                            break;
                        case "lightsnow":
                            weatherIcon="lightsnow.png";
                            break;
                        case "mcloudy":
                            weatherIcon="mcloudy.png";
                            break;
                        case "oshower":
                            weatherIcon="oshower.png";
                            break;
                        case "pcloudy":
                            weatherIcon="pcloudy.png";
                            break;
                        case "rain":
                            weatherIcon="rain.png";
                            break;
                        case "rainsnow":
                            weatherIcon="rainsnow.png";
                            break;
                        case "snow":
                            weatherIcon="snow.png";
                            break;
                        case "tsrain":
                            weatherIcon="tsrain.png";
                            break;
                        case "tstorm":
                            weatherIcon="tstorm.png";
                            break;
                        case "windy":
                            weatherIcon="windy.png";
                            break;
                        default:
                            weatherIcon="default.jpg";
                    }
                    

                    // Convert the date to a more readable format
                    const dateStr = dayData.date.toString();
                    const year = dateStr.slice(0, 4);
                    const month = dateStr.slice(4, 6);
                    const day = dateStr.slice(6, 8);
                    const date = new Date(year, month - 1, day);
                    const options = { weekday: 'short', month: 'short', day: 'numeric' };
                    const formattedDate = date.toLocaleDateString('en-US', options);

                    dayDiv.innerHTML= `
                        <strong">${formattedDate}</strong><br>
                        <img src="${weatherIcon}" alt="${dayData.weather}"><br>
                        ${dayData.weather}<br>
                        High: <span class="temperature">${dayData.temp2m.max}°C</span><br>
                        Low: <span class="temperature">${dayData.temp2m.min}°C</span>
                    `;
                    
                    cityDisplay.appendChild(dayDiv);
                });
            })
            .catch(error => console.error('Erreur:', error));
        
        cityDisplay.style.display='flex';
    } else {
        cityDisplay.style.display='none';
    }
}


function switchUnit() {
    const temperatureElements = document.getElementsByClassName('temperature');
    for (let i = 0; i < temperatureElements.length; i++) {
        const temperatureElement = temperatureElements[i];
        let temperature = parseFloat(temperatureElement.textContent);
        if (isCelsius) {
            // Convert Celsius to Fahrenheit
            temperature = temperature * 9/5 + 32;
            temperatureElement.textContent = temperature.toFixed(1) + '°F';
        } else {
            // Convert Fahrenheit to Celsius
            temperature = (temperature - 32) * 5/9;
            temperatureElement.textContent = temperature.toFixed(1) + '°C';
        }
    }
    isCelsius = !isCelsius;
    document.getElementById('switch-unit').textContent = isCelsius ? 'Switch to °F' : 'Switch to °C';
}

document.getElementById('switch-unit').addEventListener('click', function(event) {
    event.preventDefault();
    switchUnit();
});
