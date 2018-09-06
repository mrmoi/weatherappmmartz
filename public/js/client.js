"use strict";

(function() {

    // Get coordinates and pass on to sendToTranslate function
    function getLocation(objectid) {
        if (navigator.geolocation) {
            var timeoutVal = 10 * 1000 * 1000;
            navigator.geolocation.getCurrentPosition(function(position) {
                displayPosition(position, objectid)
                }, errorHandler,
                {enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
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

    function displayPosition(position, objectid) {
        var coordsxy = (position.coords.latitude + "," + position.coords.longitude).toString();
        sendToTranslate(objectid, coordsxy);
    }

    // split coordinates
    // reverse geocode coordinates using openweathermap API
    // display coordinates and city name in main page
    function sendToTranslate(id, geom) {
        var coordis = geom.split(",")
        var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=";
        var apiKey = "0419507b4c048eb4f82fc9ee5d7dd6e2";
        //console.log(apiUrl + coordis[0] + "&lon=" + coordis[1] + "&apiKey=" + apiKey)

        function translateCoords() {
            httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = responseMethod;
            httpRequest.open('GET', apiUrl + coordis[0] + "&lon=" + coordis[1] + "&apiKey=" + apiKey);
            httpRequest.send();
        }

        function responseMethod() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    updateLoc(httpRequest.responseText);
                } else {
                    console.log("unsuccessful call");
                }
                console.log(httpRequest.responseText);
            }
        }

        function updateLoc(responseText) {
            var response = JSON.parse(responseText);
            var lon = response.coord.lon;
            var lat = response.coord.lat;
            var city = response.name;

            var corddiv = document.getElementById("coordinates");
            corddiv.innerHTML = "<p>Longitude: " + lon + ", Latitude: " + lat + "</p>"
            
            var citydiv = document.getElementById("city");
            citydiv.innerHTML = "<p>City: " + city + "</p>"
        }
        
        translateCoords();
    }

 

    var url = "https://query.yahooapis.com/v1/public/yql?q=";
    var consKey = "dj0yJmk9bUlLZ09jUE5IUm1SJmQ9WVdrOVFtaEdXbVpuTnpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD03Mg--";
    var location = "phoenix,az";
    var query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + location + "')&format=json";
    var httpRequest;

    function makeReq() {
        httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = resMethod;
        httpRequest.open('GET', url + query, + '&consKey=' + consKey);
        httpRequest.send();
    }

    function resMethod() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                updateUI(httpRequest.responseText);
            } else {
                updateUIError();
            }
            console.log(httpRequest.responseText);
        }
    }

    function updateUI(responseText) {
        var response = JSON.parse(responseText);
        
        var city = response.query.results.channel.location.city;
        var country = response.query.results.channel.location.country;
        var region = response.query.results.channel.location.region;

        var temp = response.query.results.channel.item.condition.temp;
        var sky = response.query.results.channel.item.condition.text;

        var windspeed = response.query.results.channel.wind.speed;
        var humidity = response.query.results.channel.atmosphere.humidity;

        var sunrise = response.query.results.channel.astronomy.sunrise;
        var sunset = response.query.results.channel.astronomy.sunset;
        
        
        function updateLocation() {
            var locationdiv = document.getElementById("location");
            locationdiv.innerHTML = "<p>" + city + ", " + region + ", " + country + "</p>"                  
        }

        function updateCondition() {
            var conditiondiv = document.getElementById("condition");
            conditiondiv.innerHTML = "<p>Current Temp: " + temp + "&#8457;, Conditions: " + sky + "</p>"                  
        }

        function updateAtmosphere() {
            var atmospherediv = document.getElementById("atmosphere");
            atmospherediv.innerHTML = "<p>Wind Speed: " + windspeed + " MPH, Humidity: " + humidity + "%</p>"                  
        }

        function updateAstronomy() {
            var astronomydiv = document.getElementById("astronomy");
            astronomydiv.innerHTML = "<p>Sunrise: " + sunrise.slice(0,3) + "0 AM"
                                    + ", Sunset: " + sunset.toUpperCase() + "</p>"                  
        }

        
        updateLocation();
        updateCondition();
        updateAtmosphere();
        updateAstronomy();

    }

    function updateUIError() {
        var resBox = document.getElementById("resBox");
        resBox.className = "hidden";
    }


    getLocation();
    makeReq();
    
})();
