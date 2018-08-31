"use strict";

(function() {
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

    makeReq();
})();
/* 
var geolocation = document.getElementById("geoposition");

function showPosition(position) {
    geolocation.innerHTML = "Latitude: " + position.coords.latitude + 
        "<br>Longitude: " + position.coords.longitude;
}

function getLocation() {
    if (navigator.geolocation) {
        console.log("Yes");
        console.log(timestamp);
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        geolocation.innerHTML = "Geolocation is not supported by this browser.";
    }
} */
