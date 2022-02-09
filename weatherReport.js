var currentPlace;
var today = new Date();
var day;
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
var daylist = ["Sun", "Mon", "Tue", "Wed ", "Thur", "Fri", "Sat"];
var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
var exclude = `weekly`;
var api_key = `5bc294c4e428e6be62b25e633ae671c8`;
getLocation();
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

async function showPosition(position) {
  var exclude = "weekly";
  var res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${api_key}`
  );
  var city = await res.json();
  currentPlace = city.name;
  dailyForcast();
}

async function weatherForcast() {
  var city_name = document.getElementById("city_name").value || currentPlace;
  var googleMaps = document.querySelector("iframe");
  googleMaps.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDeEKaTl6ZbHCEUjXN8Jk2EObz0vGqtZTM
    &q=${city_name}&zoom=14&maptype=satellite`;
  var response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}`
  );
  var data = await response.json();
  currentForcast(data);
  return data;
}

async function sevendaysWeather() {
  var data = await weatherForcast();
  var lon = data.coord.lon;
  var lat = data.coord.lat;
  var res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${api_key}`
  );
  var weeklyData = await res.json();
  return weeklyData.daily;
}

async function dailyForcast() {
  var weeklyData = await sevendaysWeather();
  document.getElementById("weeklyForcast").innerHTML = "";
  day = today.getDay();
  weeklyData.forEach((daily) => {
    displayDailyForcast(daily);
  });
}

function displayDailyForcast(daily) {
  if (day > 6) {
    day = 0;
  }
  console.log(daily.weather[0].icon);
  var dayBox = document.createElement("div");
  var dayName = document.createElement("p");
  dayName.textContent = daylist[day];
  day++;
  var iconDiv = document.createElement("div");
  var icon = document.createElement("img");
  icon.src = `http://openweathermap.org/img/wn/${daily.weather[0].icon}.png`;
  iconDiv.append(icon);
  var maxTemp = document.createElement("p");
  maxTemp.textContent = `${Math.round(daily.temp.max - 273)}°C`;
  var minTemp = document.createElement("p");
  minTemp.textContent = `${Math.round(daily.temp.min - 273)}°C`;
  dayBox.append(dayName, iconDiv, maxTemp, minTemp);
  document.getElementById("weeklyForcast").append(dayBox);
}

function currentForcast(data) {
  console.log(data);
  var currentPlaceWeather = document.getElementById("currentForcast");
  currentPlaceWeather.innerHTML = "";
  var mainDiv1 = document.createElement("div");
  var mainDiv2 = document.createElement("div");
  var h1 = document.createElement("h1");
  h1.style.fontSize = "40px";
  h1.style.margin = "13px";
  h1.textContent = data.name;
  var h2 = document.createElement("h1");
  h2.textContent = `${Math.round(data.main.temp - 273)}°C`;
  var icon = document.createElement("img");
  icon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  var humidity = document.createElement("p");
  humidity.textContent = "Humidity " + data.main.humidity + "%";
  var windSpeed = document.createElement("p");
  windSpeed.textContent = "Wind Speed " + data.wind.speed + "m/s";
  var description = document.createElement("h3");
  description.textContent = `${days[today.getDay()]}, ${today.getDate()} ${
    months[today.getMonth()]
  } ${today.getFullYear()}  `;
  var description2 = document.createElement("h3");
  description2.textContent = "Report : " + `${data.weather[0].description}`;
  description2.style.textTransform = "uppercase";
  mainDiv1.append(h1, description, description2);
  mainDiv2.append(icon, h2, humidity, windSpeed);
  currentPlaceWeather.append(mainDiv1, mainDiv2);
}

function numOfDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
