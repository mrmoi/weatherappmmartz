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
                console.log(httpRequest.responseText);
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

        function weatherIcon(iconCode) {
            
        return (iconCode == 0) ? "<i class='wi wi-yahoo-0'></i>":
        (iconCode == 1) ? "<i class='wi wi-yahoo-1'></i>":
        (iconCode == 2) ? "<i class='wi wi-yahoo-2'></i>":         
        (iconCode == 3) ? "<i class='wi wi-yahoo-3'></i>":         
        (iconCode == 4) ? "<i class='wi wi-yahoo-4'></i>":         
        (iconCode == 5) ? "<i class='wi wi-yahoo-5'></i>":         
        (iconCode == 6) ? "<i class='wi wi-yahoo-6'></i>":         
        (iconCode == 7) ? "<i class='wi wi-yahoo-7'></i>":         
        (iconCode == 8) ? "<i class='wi wi-yahoo-8'></i>":
        (iconCode == 9) ? "<i class='wi wi-yahoo-9'></i>":
        (iconCode == 10) ? "<i class='wi wi-yahoo-10'></i>":
        (iconCode == 11) ? "<i class='wi wi-yahoo-11'></i>":
        (iconCode == 12) ? "<i class='wi wi-yahoo-12'></i>":
        (iconCode == 13) ? "<i class='wi wi-yahoo-13'></i>":
        (iconCode == 14) ? "<i class='wi wi-yahoo-14'></i>":
        (iconCode == 15) ? "<i class='wi wi-yahoo-15'></i>":
        (iconCode == 16) ? "<i class='wi wi-yahoo-16'></i>":
        (iconCode == 17) ? "<i class='wi wi-yahoo-17'></i>":
        (iconCode == 18) ? "<i class='wi wi-yahoo-18'></i>":
        (iconCode == 19) ? "<i class='wi wi-yahoo-19'></i>":
        (iconCode == 20) ? "<i class='wi wi-yahoo-20'></i>":
        (iconCode == 21) ? "<i class='wi wi-yahoo-21'></i>":
        (iconCode == 22) ? "<i class='wi wi-yahoo-22'></i>":
        (iconCode == 23) ? "<i class='wi wi-yahoo-23'></i>":
        (iconCode == 24) ? "<i class='wi wi-yahoo-24'></i>":
        (iconCode == 25) ? "<i class='wi wi-yahoo-25'></i>":
        (iconCode == 26) ? "<i class='wi wi-yahoo-26'></i>":
        (iconCode == 27) ? "<i class='wi wi-yahoo-27'></i>":
        (iconCode == 28) ? "<i class='wi wi-yahoo-28'></i>":
        (iconCode == 29) ? "<i class='wi wi-yahoo-29'></i>":
        (iconCode == 30) ? "<i class='wi wi-yahoo-30'></i>":
        (iconCode == 31) ? "<i class='wi wi-yahoo-31'></i>":
        (iconCode == 32) ? "<i class='wi wi-yahoo-32'></i>":
        (iconCode == 33) ? "<i class='wi wi-yahoo-33'></i>":
        (iconCode == 34) ? "<i class='wi wi-yahoo-34'></i>":
        (iconCode == 35) ? "<i class='wi wi-yahoo-35'></i>":
        (iconCode == 36) ? "<i class='wi wi-yahoo-36'></i>":
        (iconCode == 37) ? "<i class='wi wi-yahoo-37'></i>":
        (iconCode == 38) ? "<i class='wi wi-yahoo-38'></i>":
        (iconCode == 39) ? "<i class='wi wi-yahoo-39'></i>":
        (iconCode == 40) ? "<i class='wi wi-yahoo-40'></i>":
        (iconCode == 41) ? "<i class='wi wi-yahoo-41'></i>":
        (iconCode == 42) ? "<i class='wi wi-yahoo-42'></i>":
        (iconCode == 43) ? "<i class='wi wi-yahoo-43'></i>":
        (iconCode == 44) ? "<i class='wi wi-yahoo-44'></i>":
        (iconCode == 45) ? "<i class='wi wi-yahoo-45'></i>":
        (iconCode == 46) ? "<i class='wi wi-yahoo-46'></i>":
        (iconCode == 47) ? "<i class='wi wi-yahoo-47'></i>":
        (iconCode == 3200) ? "<i class='wi wi-yahoo-3200'></i>":
            "Not a valid forecast"
        }

        for (var i = 0; i < hilow.length; i++) {

        $(".forecast" + i).append( '<p>' + weatherIcon(hilow[i].code) + '</p>' +
                                   "<p>" + hilow[i].day + "</p>"  +
                                   "<p>" + (hilow[i].date).substring(0, 7) + "</p>" + 
                                   "<p>" + hilow[i].high + "&#8457</p>" + 
                                   "<p>"  + hilow[i].low  + "&#8457</p>"
                                   );
        }

    }       

    getGeoLocation();

    

})();
