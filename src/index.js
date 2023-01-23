//Elements definition
let apiKey = "0d1add16b3t7670282dd93a5aob40cbf";
let temperatureElement = document.querySelector("#temperature");
let cityElement = document.querySelector("#city");
let cityInput = document.querySelector("#city-input");
let currentDate = document.querySelector("#date");
let searchForm = document.querySelector("#search-form");
let fahrenheit = document.querySelector("#fahrenheit");
let celcius = document.querySelector("#celcius");
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind");
let highTempElement = document.querySelector("#high-temp");
let lowTempElement = document.querySelector("#low-temp");
let descriptionElement = document.querySelector("#description");
let currentLocation = document.querySelector("#current-location");
let iconElement = document.querySelector(".weather-icon");

//other constants definitions
let tempInCelcius = 27;
let tempInFar = Math.round(tempInCelcius * 9) / 5 + 32;
let currentTime = new Date();

//functions
function dateFormat(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dayList = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayList];

  return `${day} ${hours}:${minutes}`;
}

// function displayForecast() {
function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(response);

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay) {
    forecastHTML =
      forecastHTML +
      `
    <div class="col">
    <div class="weather-forecast-date">${timeConverter(forecastDay.time)}</div>
    <img
    class="forecast-icon"
    src="${forecastDay.condition.icon_url}"
    alt="rainy-weather"
    width="24px"
    />
    <div class="weather-forecast-temperatures">
    <span class="weather-forecast-temperature-max">${Math.round(
      forecastDay.temperature.maximum
    )}°</span>
    <span class="weather-forecast-temperature-min">${Math.round(
      forecastDay.temperature.minimum
    )}°</span>
    </div>
    </div>
    `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function search(event) {
  event.preventDefault();
  let city = cityInput.value;
  // let apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  axios.get(apiUrl).then(function (response) {
    // let lat = response.data[0].lat;
    let lat = response.data.coordinates.latitude;
    // let lon = response.data[0].lon;
    let lon = response.data.coordinates.longitude;
    fetchWeatherData(lat, lon);
  });
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "0d1add16b3t7670282dd93a5aob40cbf";
  let units = "metric";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function getPresentLocation(event) {
  event.preventDefault();

  getCurrentLocation();
}
function convertFahrenheit(event) {
  event.preventDefault();
  temperatureElement.innerHTML = Math.round(tempInFar);
  // remove the active class from the celcius
  celcius.classList.remove("active");
  fahrenheit.classList.add("active");
}

function convertCelcius(event) {
  event.preventDefault();
  temperatureElement.innerHTML = tempInCelcius;
  celcius.classList.add("active");
  fahrenheit.classList.remove("active");
}

function showTemperature(response) {
  let city = response.data.city;
  cityElement.innerHTML = city;
  let temperature = Math.round(response.data.temperature.current);
  temperatureElement.innerHTML = temperature;
  let humidity = response.data.temperature.humidity;
  humidityElement.innerHTML = `Humidity: ${humidity} %`;
  let wind = Math.round(response.data.wind.speed);
  windElement.innerHTML = `Wind: ${wind} km/h`;
  // let highTemp = Math.round(response.data.main.temp_max);
  // highTempElement.innerHTML = `H: ${highTemp}`;
  // let lowTemp = Math.round(response.data.main.temp_min);
  // lowTempElement.innerHTML = `L: ${lowTemp}`;
  let description = response.data.condition.description;
  descriptionElement.innerHTML = description;

  iconElement.src = response.data.condition.icon_url;
  iconElement.alt = response.data.condition.icon;

  getForecast(response.data.coordinates);
}

function fetchWeatherData(lat, lon) {
  let units = "metric";
  // let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang={lang}&units=${units}`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lat=${lat}&lon=${lon}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentLocation(city) {
  navigator.geolocation.getCurrentPosition(function (position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    fetchWeatherData(lat, lon);
  });
}

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
  const weekDay = a.getUTCDay();

  return days[weekDay];
}

// Event listeners
searchForm.addEventListener("submit", search);
fahrenheit.addEventListener("click", convertFahrenheit);
celcius.addEventListener("click", convertCelcius);
currentLocation.addEventListener("click", getPresentLocation);

currentDate.innerHTML = dateFormat(currentTime);

getCurrentLocation("Lagos");

// displayForecast();
