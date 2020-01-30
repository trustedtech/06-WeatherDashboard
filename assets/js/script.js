//Create references to help us build our queries
var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
var uviURL = "http://api.openweathermap.org/data/2.5/uvi?lat=";
var iconURL = "http://openweathermap.org/img/wn/";
var icon2x = "@2x.png";
var apiKey = "&APPID=2b853bacb586a6ba502bc5abb5c5ba1b";
var unitsParam = "&units=imperial";

//Create references to help us navigate through extended forecasts
var omitForecast = moment().format("YYYY-MM-DD" + " 12:00:00");

//Listen for any button clicks
$('button').click(function(){

    //Identify and handle Search Button click
    if ($(this).is('#searchBtn')) {
        var city = $.trim($('#cityInput').val());
        console.log(city);
        getCurrentWeather(city);
        getFutureWeather(city);
    }

});


function getCurrentWeather(keyword) {

    queryURL = weatherURL + keyword + unitsParam + apiKey ;

    //Queries OpenWeather API for current weather data
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
    //console.log(response);

    //Update the UI with data retrieved from the API
    $('#cityHeading').text(response.name);
    $('#weatherIcon').attr('src', iconURL + response.weather[0].icon + icon2x);
    $('#weatherDesc').text(response.weather[0].description);
    $('#cityTemp').text(response.main.temp + " F");
    $('#cityHumid').text(response.main.humidity + "%");
    $('#cityWind').text(response.wind.speed + " mph");

        //Using coordinate data from the prior query, we must now do a separate query for the UV index
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        //console.log(lat + " , " + lon);

        uviqueryURL = uviURL + lat + "&lon=" + lon + apiKey;

        $.ajax({
            url: uviqueryURL,
            method: "GET"
        }).then(function(uvidata) {
            //console.log(uvidata);

            //Update the UI with the UV index data
            $('#cityUVi').text(uvidata.value);

        });

    });

}

function getFutureWeather(keyword) {

    queryURL = forecastURL + keyword + unitsParam + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
    console.log(response);

        response.list.forEach(function(timeblock, index){

            var dateText = timeblock.dt_txt;
            if ( dateText.includes('12:00:00') && dateText !== omitForecast ) {
                
                //console.log(timeblock.dt_txt);
                var fDate = $('<p/>').text(moment(timeblock.dt_txt).format("M/D/YY"));
                var fIcon = $('<img/>').attr('src', iconURL + timeblock.weather[0].icon + icon2x);
                var fTemp = $('<p/>').text("Temp: " + timeblock.main.temp);
                var fHumid = $('<p/>').text("Humidity: " + timeblock.main.humidity);
                var fBlock = $('<div/>').addClass('col-md-2 ex-fcast-block');
                $(fBlock).append(fDate, fIcon, fTemp, fHumid);
                $('#extendedFcasts').append(fBlock);

            }
        });

    });

}
