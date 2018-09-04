"use strict";

(function() {

    // Get coordinates 
    function getLocation(objectid) {
        if (navigator.geolocation) {
            //console.log("geolocation is supported");
            //navigator.geolocation.getCurrentPosition(getCoords, errorHandler);
            //navigator.geolocation.getCurrentPosition(getCoords);
/*             navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    longitude: position.coords.longitude
                }; */

                //console.log(pos);
                //return pos;
            var timeoutVal = 10 * 1000 * 1000;
            navigator.geolocation.getCurrentPosition(
                function(position) {displayPosition(position, objectid)}, 
                errorHandler,
                {enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
            );
        } else { 
            console.log("geolocation is not supported");
        }
    }

    function displayPosition(position, objectid) {
        //alert(objectid + " ##  Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
        var geometry = (position.coords.latitude + "," + position.coords.longitude).toString();
        sendToServer(objectid, geometry);
    }

    function sendToServer(id, geom) {
        //alert("my id is: '" + id + "' " + geom);
        var coordis = geom.split(",")
        console.log(coordis);
        var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=";
        var apiKey = "0419507b4c048eb4f82fc9ee5d7dd6e2";
        console.log(apiUrl + coordis[0] + "&lon=" + coordis[1] + "&apiKey=" + apiKey)

        function translateCoords() {
            httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = responseMethod;
            httpRequest.open('GET', apiUrl + coordis[0] + "&lon=" + coordis[1] + "&apiKey=" + apiKey);
            httpRequest.send();
        }

        function responseMethod() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    console.log("successful call");
                } else {
                    console.log("unsuccessful call");
                }
                console.log(httpRequest.responseText);
            }
        }
        
        translateCoords();
    }

    // Assign coordinates latx and longx to variables
/*     function getCoords(pos) {
        var crd = pos.coords;

        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);

        var coordinateDiv = document.getElementById("coordinates");
            coordinateDiv.innerHTML = "<p>Latitude: " + `${crd.latitude}` + ", Longitude: " + `${crd.longitude}` + "</p>" 
    } */

    // location error handler
     function errorHandler(err) {
        if(err.code == 1) {
            console.log("Access denied");
        } else if( err.code == 2) {
            console.log("Position is unavailable");
        }
    }

/*     function showPosition(position) {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);

        return position.coords.latitude;
        return position.coords.longitude;
} */
    
    getLocation();
    

    /* var apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
    var apiKey = "0419507b4c048eb4f82fc9ee5d7dd6e2";

    function makeReq() {
        httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = resMethod;
        httpRequest.open('GET', apiUrl + getLocation, + '&consKey=' + apiKey);
        httpRequest.send();
    }
 */
 /*    function decodeCoords {
        httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = resMethod;
        httpRequest.open();
    }
 */
    //https://api.openweathermap.org/data/2.5/weather?lat=33.645494299999996&lon=-111.98607539999999

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
