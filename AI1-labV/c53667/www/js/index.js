document.addEventListener("DOMContentLoaded", function() {
    const pogodaToday = document.getElementById("pogodaToday");
    const pogodaForecast = document.getElementById("pogodaForecast");
    const miasto = document.getElementById("city");
    const weatherResult = document.getElementById("weatherResult");
    const forecastResult = document.getElementById("forecastResult");

    if (pogodaToday && pogodaForecast && miasto && weatherResult && forecastResult) {
        pogodaToday.addEventListener("click", async function() {
            const city = miasto.value;
            try {
                const data = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7c51b1980eba0bffc55e1e55d0888c5c&units=metric&lang=pl`, true);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                resolve(JSON.parse(xhr.responseText));
                            } else {
                                reject('Error fetching weather data');
                            }
                        }
                    };
                    xhr.send();
                });
                console.log(data);
                const roundedTemp = Math.round(data.main.temp * 2) / 2;
                const feelsLikeTemp = Math.round(data.main.feels_like * 2) / 2;
                const icon = data.weather[0].icon;
                weatherResult.innerHTML = `
                    <h3>Pogoda w ${data.name}</h3>
                    <div id="oneDay">
                        <h3>Today</h3>
                        <p>Temperatura: ${roundedTemp}°C</p>
                        <p>Odczuwalna temperatura: ${feelsLikeTemp}°C</p>
                        <p>Pogoda: ${data.weather[0].description}</p>
                        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">
                    </div>
                `;
            } catch (error) {
                console.error('Error:', error);
                weatherResult.innerHTML = `<p>Error fetching weather data. Please try again.</p>`;
            }
        });

        pogodaForecast.addEventListener("click", async function() {
            const city = miasto.value;
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=7c51b1980eba0bffc55e1e55d0888c5c&units=metric&lang=pl`);
                const forecastData = await response.json();
                console.log(forecastData);
                let forecastHTML = '<h3>Prognoza na 5 dni</h3>';
                forecastData.list.forEach((forecast, index) => {
                    if (index % 8 === 0) {
                        const roundedTemp = Math.round(forecast.main.temp * 2) / 2;
                        const feelsLikeTemp = Math.round(forecast.main.feels_like * 2) / 2;
                        const icon = forecast.weather[0].icon;
                        forecastHTML += `
                            <div id="fiveDays">
                                <p>${new Date(forecast.dt_txt).toLocaleDateString()}</p>
                                <p>Temperatura: ${roundedTemp}°C</p>
                                <p>Odczuwalna temperatura: ${feelsLikeTemp}°C</p>
                                <p>Pogoda: ${forecast.weather[0].description}</p>
                                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">
                            </div>
                        `;
                    }
                });
                forecastResult.innerHTML = forecastHTML;
            } catch (error) {
                console.error('Error:', error);
                forecastResult.innerHTML = `<p>Error fetching 5-day forecast data. Please try again.</p>`;
            }
        });
    }
});