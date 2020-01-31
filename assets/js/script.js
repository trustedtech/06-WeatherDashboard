//Create references to help us build our queries
var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
var uviURL = "http://api.openweathermap.org/data/2.5/uvi?lat=";
var iconURL = "http://openweathermap.org/img/wn/";
var icon2x = "@2x.png";
var apiKey = "&APPID=2b853bacb586a6ba502bc5abb5c5ba1b";
var unitsParam = "&units=imperial";
var searchHistory = [];

//Create references to help us navigate through extended forecasts
var omitForecast = moment().format("YYYY-MM-DD" + " 12:00:00");

//Retrieve any saved searches and add them to the UI
retrieveSearches();

//Listen for any button clicks
$('button').click(function(){

    //Clear old weather details from the UI
    $('#extendedFcasts').empty();


    //Identify and handle Search Button click
    if ($(this).is('#searchBtn')) {
        var city = $.trim($('#cityInput').val());
        console.log(city);
        getCurrentWeather(city);
        getFutureWeather(city);

        //Adds this search to local storage and creates a Recent Search button
    }

});


function getCurrentWeather(keyword) {

    queryURL = weatherURL + keyword + unitsParam + apiKey ;

    //Queries OpenWeather API for current weather data
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

    //Update the UI with data retrieved from the API
    $('#cityHeading').text(response.name);
    $('#weatherIcon').attr('src', iconURL + response.weather[0].icon + icon2x);
    $('#weatherDesc').text(response.weather[0].description);
    $('#cityTemp').text(Math.round(response.main.temp) + "\xB0F");
    $('#cityHumid').text(response.main.humidity + "%");
    $('#cityWind').text(response.wind.speed + " mph");

        //Using coordinate data from the prior query, do a separate query for the UV index
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        console.log("Coords: " + lat + lon);

        uviqueryURL = uviURL + lat + "&lon=" + lon + apiKey;

        $.ajax({
            url: uviqueryURL,
            method: "GET"
        }).then(function(uvidata) {
            console.log(uvidata);

            //Update the UI with the UV index data
            $('#cityUVi').text(uvidata.value);

        });

        storeSearches(response.name);

    });

}

function getFutureWeather(keyword) {

    queryURL = forecastURL + keyword + unitsParam + apiKey;

    //Queries OpenWeather API for future weather data
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
    console.log(response);

        //Loop through the timeblocks to find the ones that match a noon timestamp on future dates
        response.list.forEach(function(timeblock, index){

            var dateText = timeblock.dt_txt;
            if ( dateText.includes('12:00:00') && dateText !== omitForecast ) {

                //Update the UI with data retrieved from the API
                var fDate = $('<p/>').text(moment(timeblock.dt_txt).format("M/D/YY"));
                var fIcon = $('<img/>').attr('src', iconURL + timeblock.weather[0].icon + icon2x);
                var fTemp = $('<p/>').html("Temp: <span>" + Math.round(timeblock.main.temp) + "\xB0F</span>");
                var fHumid = $('<p/>').html("Humidity: <span>" + timeblock.main.humidity + "%</span>");
                var fBlock = $('<div/>').addClass('col-md-2 ex-fcast-block');
                $(fBlock).append(fDate, fIcon, fTemp, fHumid);
                $('#extendedFcasts').append(fBlock);

            }
        });

    });

}

function storeSearches(city){

    //console.log("This is the city to store: " + city);
    if ( city !== null ){
        var storedSearches = JSON.parse(localStorage.getItem("storedSearches"));

        if ( storedSearches === null ) {
            storedSearches = [];
            storedSearches.push(city);
            var lastSearch = $('<button/>').addClass("btn btn-outline-primary quick-search").attr('data-city', city).html("<i class='fas fa-map-marker-alt mr-3'></i>" + city);
            $('#uiControl').append(lastSearch);
        }
        else if ( !(storedSearches.includes(city))) {
            storedSearches.push(city);
            var lastSearch = $('<button/>').addClass("btn btn-outline-primary quick-search").attr('data-city', city).html("<i class='fas fa-map-marker-alt mr-3'></i>" + city);
            $('#uiControl').append(lastSearch);
        }

        localStorage.setItem("storedSearches", JSON.stringify(storedSearches));
    }  
    else {
        return;
    }
    
}

function retrieveSearches(){
    var storedSearches = JSON.parse(localStorage.getItem("storedSearches"));
    if ( storedSearches !== null ) {
        storedSearches.forEach(function(city, index){
            var recent = $('<button/>').addClass("btn btn-outline-primary quick-search").attr('data-city', city).html("<i class='fas fa-map-marker-alt mr-3'></i>" + city);
            $('#uiControl').append(recent);
        })
    }
}
