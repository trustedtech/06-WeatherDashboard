var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
var apiKey = "&APPID=2b853bacb586a6ba502bc5abb5c5ba1b";
var unitsParam = "&units=imperial";

queryURL = weatherURL + "Orlando" + apiKey + unitsParam;

$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
console.log(response);
});

queryURL = forecastURL + "Orlando" + apiKey + unitsParam;

$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
console.log(response);
});

// Open Weather API-Key:  2b853bacb586a6ba502bc5abb5c5ba1b