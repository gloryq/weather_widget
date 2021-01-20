const electron = require('electron').remote;
const net = electron.net;
const ipc = require('electron').ipcRenderer;
var apiKey = require('./config').config.MY_KEY;

let request;
clientRequest();

function clientRequest() {
    request = net.request ( {
        method: 'GET',
        protocol: 'https:',
        hostname: 'api.openweathermap.org',
        port: 443,
        path: '/data/2.5/weather?id=6173331&units=metric&appid=' + apiKey
    });
    
    request.on('response', response => {
        response.on('data', (chunk) => {
            let bodyJSON = JSON.parse(chunk);
            console.log(bodyJSON);
            
            var currentWeather = document.getElementById('current_weather');
            var description = document.getElementById('weather_desc');
            var city = document.getElementById('city');
            var sunset = document.getElementById('sunset');
            var temperature = document.getElementById('temperature');
            var high_low = document.getElementById('high_low')
            var feels_like = document.getElementById('feels_like');
            var wind_speed = document.getElementById('wind_speed');
    
            currentWeather.innerHTML = bodyJSON.weather[0].main + '&nbsp&nbsp';
            description.innerHTML = bodyJSON.weather[0].description;
            city.innerHTML = bodyJSON.name;
            temperature.innerHTML = bodyJSON.main.temp + '&#8451';
            high_low.innerHTML = 'H: ' + bodyJSON.main.temp_max + '&#8451' + ' &#8226 L: ' + bodyJSON.main.temp_min + '&#8451';
            feels_like.innerHTML = 'feels like ' + bodyJSON.main.feels_like + '&#8451';
            wind_speed.innerHTML = 'wind ' + Math.round(bodyJSON.wind.speed*36/10) + ' km/h';
    
            let unixTime = bodyJSON.sys.sunset;
            var date = new Date(unixTime * 1000); // convert to seconds
            var hours = date.getHours();
            var minutes = '0' + date.getMinutes();
    
            var formattedTime = hours + ':' + minutes.substr(-2);
            sunset.innerHTML = 'sunset ' + formattedTime;
    
            ipc.send('response_loaded');
        });
    });
    
    request.end();
}

setInterval(function() {
    clientRequest();
}, 900000);