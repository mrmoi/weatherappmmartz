"use strict";

(function() {

    function getGeoLocation() {
        if (navigator.geolocation) {
            var timeoutVal = 10 * 1000 * 1000;
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    getCoordinates(position)
                }, errorHandler, {enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
            );
        } else { 
            console.log("geolocation is not supported");
        }
    }

    function errorHandler(err) {
        if(err.code == 1) {
            console.log("Access denied");
        } else if( err.code == 2) {
            console.log("Position is unavailable");
        }
    }
    // Create error message for user

    function getCoordinates(results) {
        makeReq(results.coords.latitude, results.coords.longitude);
    }

    var httpRequest;

    function makeReq(lat, long) {
        console.log("Latitude: " + lat + ", Longitude: " + long);
        var url = "https://query.yahooapis.com/v1/public/yql?";
        var consKey = "dj0yJmk9bUlLZ09jUE5IUm1SJmQ9WVdrOVFtaEdXbVpuTnpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD03Mg--";
        var query = "q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='(" + lat + "," + long + ")')&format=json";
        
        httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = handleResponse;
        httpRequest.open('GET', url + query, + '&consKey=' + consKey);
        httpRequest.send();
    }

    function handleResponse() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                updateUI(httpRequest.responseText);
                console.log("success");
            } else {
                updateUIError();
            }
        }
    }

    function updateUIError() {
        var resBox = document.getElementById("resBox");
        resBox.className = "hidden";
    }

    function updateUI(responseText) {
        var response = JSON.parse(responseText);
        var location = response.query.results.channel.location;
        var wind = response.query.results.channel.wind;
        var atmosphere = response.query.results.channel.atmosphere;
        var astronomy = response.query.results.channel.astronomy;
        var condition = response.query.results.channel.item.condition;

        updateLocation(location);
        updateWind(wind);
        updateAtmosphere(atmosphere);
        updateAstronomy(astronomy);
        updateCondition(condition);
    }

    function updateLocation(location) {
        var locationdiv = document.getElementById("location");
        locationdiv.innerHTML = "<p>" + location.city + ", " + location.region + ", " + location.country + "</p>" 
    }

    function updateWind(wind) {
        var windiv = document.getElementById("wind");
        windiv.innerHTML = "<p>Feels like: " + wind.chill + " &#8457, Direction: " + wind.direction + ", Speed: " + wind.speed + " MPH</p>"
    }

    function updateAtmosphere(atmosphere) {
        var atmosphereDiv = document.getElementById("atmosphere");
        atmosphereDiv.innerHTML = "<p>Humidity: " + atmosphere.humidity + "%, Visibility: " + atmosphere.visibility + " Miles</p>";
    }

    function updateAstronomy(astronomy) {
        var astronomyDiv = document.getElementById("astronomy");
        astronomyDiv.innerHTML = "<p>Sunrise: " + astronomy.sunrise + ", Sunset: " + astronomy.sunset + "</p>";
    }

    function updateCondition(condition) {
        var conditionDiv = document.getElementById("condition");
        conditionDiv.innerHTML = "<p>Current Temperature: " + condition.temp + "&#8457</p>";
    }

    getGeoLocation();

})();


