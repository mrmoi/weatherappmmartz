"use strict";

(function() {

    function getGeoLocation() {
        if (navigator.geolocation) {
            var timeoutVal = 10 * 1000 * 1000;
            console.log("getGeolocation");

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
            handleDeniedAccess(err.code);
        } else if( err.code == 2) {
            console.log("Position is unavailable");
        }
    }

    function handleDeniedAccess(err) {
        var progress = document.getElementById("progress");
        progress.innerHTML = "<p> Please enable Geolocation</p>";
        console.log(err);
    }
    // Create error message for user

    function getCoordinates(results) {
        makeReq(results.coords.latitude, results.coords.longitude);
        console.log("getCoordinates");
    }

    var httpRequest;

    function makeReq(lat, long) {
        console.log("Latitude: " + lat + ", Longitude: " + long);
        var url = "https://query.yahooapis.com/v1/public/yql?";
        var consKey = "dj0yJmk9bUlLZ09jUE5IUm1SJmQ9WVdrOVFtaEdXbVpuTnpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD03Mg--";
        var query = "q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='(" + lat + "," + long + ")')&format=json";
        console.log("makeReq");
        httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = handleResponse;
        httpRequest.open('GET', url + query, + '&consKey=' + consKey);
        httpRequest.send();
    }

    function handleResponse() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                console.log("handleResponse");
                updateUI(httpRequest.responseText);
                //console.log("success");
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

        var progress = document.getElementById("progress");
        progress.innerHTML = "";

        console.log("updateUI");
        var response = JSON.parse(responseText);
        var location = response.query.results.channel.location;
        var wind = response.query.results.channel.wind;
        var atmosphere = response.query.results.channel.atmosphere;
        var astronomy = response.query.results.channel.astronomy;
        var condition = response.query.results.channel.item.condition;
        var hilow = response.query.results.channel.item.forecast;

        updateLocation(location);
        updateWind(wind);
        updateAtmosphere(atmosphere);
        updateAstronomy(astronomy);
        updateCondition(condition);
        updateHiLow(hilow, condition);
        updateForecast(hilow);
    }

    function updateLocation(location) {
        var locationdiv = document.getElementById("location");
        locationdiv.innerHTML = "<p>" + location.city + ", " + location.region + ", " + location.country + "</p>" 
    }

    function updateWind(wind) {
        var windiv = document.getElementById("wind");

        var windDirection = wind.direction;
        console.log(windDirection);
        var dir = "";

        if (windDirection > 0 && windDirection < 5) {
            dir = "North";
        } else if (windDirection > 5 && windDirection < 85) {
            dir = "NE";
        } else if (windDirection > 85 && windDirection < 95) {
            dir = "East";
        } else if (windDirection > 95 && windDirection < 175) {
            dir = "SE";
        } else if (windDirection > 175 && windDirection < 185) {
            dir = "South";
        } else if (windDirection > 185 && windDirection < 265) {
            dir = "SW";
        } else if (windDirection > 265 && windDirection < 275) {
            dir = "West";
        } else {
            dir = "NW"; 
        }

        console.log(dir);
        windiv.innerHTML = "<p>Feels like: " + wind.chill + " &#8457, Direction: " + dir + ", Speed: " + wind.speed + " MPH</p>"
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
        conditionDiv.innerHTML = "<p>" + condition.temp + "&#8457</p>";
    }

    function updateHiLow(hilow, condition) {
        var hilowDiv = document.getElementById("hilow");
        hilowDiv.innerHTML = "<p>Forecast: " + condition.text + ", Low: " + hilow[0].low + "&#8457, High: " + hilow[0].high + "&#8457</p>";
        console.log(hilow[0].low);
    }

    function updateForecast(hilow) {

        for (var i = 0; i < hilow.length; i++) {

        $(".forecast" + i).append( "<p>" + hilow[i].text + "</p>" +
                                   "<p>" + hilow[i].day + "</p>"  +
                                   "<p>" + (hilow[i].date).substring(0, 7) + "</p>" + 
                                   "<p>High: " + hilow[i].high + "&#8457</p>" + 
                                   "<p>Low: "  + hilow[i].low  + "&#8457</p>"
                                   );
        }

    }       

    getGeoLocation();

})();
