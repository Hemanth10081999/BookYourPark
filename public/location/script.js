var firebaseConfig = {
    apiKey: "AIzaSyBANZCmMMwdxBEWU8nMdhMxfP25P_u_34A",
    authDomain: "bookyourpark.firebaseapp.com",
    databaseURL: "https://bookyourpark.firebaseio.com",
    projectId: "bookyourpark",
    storageBucket: "bookyourpark.appspot.com",
    messagingSenderId: "197640546163",
    appId: "1:197640546163:web:24d9b5866cd1e280674706"
};

function logout() {
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "mailid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "createDate=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "phone=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location = "../login";
}

var locations = [];
var markers = [];
var namelist = [];
var availablelist = [];

function findcookie() {
    var mailid = getCookie("mailid");
    if (mailid == "") {
        window.location = "../login";
    } else {
        if (getCookie("parked") != "") {
            window.location = "../outpark";
        }
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function loadlocation() {
    findcookie();
    document.cookie = "location=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();

    db.collection("location").get().then((data) => {
        data.forEach((data) => {

            var location = data.data()["name"];

            document.getElementById('posts').innerHTML += `
            <tr style="text-align: center;" onclick="locClick('${location}')">
            <td>${data.data()["name"]}</td>
            <td>${data.data()["address"]}</td>
            <td>${data.data()["available"]}</td>
            </tr>`;

            locations.push(new google.maps.LatLng({ lat: parseFloat(data.data()["latitude"]), lng: parseFloat(data.data()["longitude"]) }));
            namelist.push(data.data()["name"]);
            availablelist.push(data.data()["available"]);
        });
    }).catch((error) => {
        console.log(error);
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition); //position.coords.latitude, position.coords.longitude  variables for getting cooordinates
    } else {
        alert("geo location is not suported by your browser");
    }
}

function showPosition(position) {
    setTimeout(function () {
        initMaps(position.coords.latitude, position.coords.longitude);
    }, 3000);
}

function initMaps(latitude, longitude) {

    var newlatitude = latitude.toFixed(6);
    var newlongitude = longitude.toFixed(6);
    var mapProp = {
        center: new google.maps.LatLng(parseFloat(newlatitude), parseFloat(newlongitude)),
        zoom: 16,
    };
    var map = new google.maps.Map(document.getElementById("map"), mapProp);
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    var marker = new google.maps.Marker({ position: new google.maps.LatLng(parseFloat(newlatitude), parseFloat(newlongitude)), map: map, icon: image });

    for (var i = 0; i < locations.length; i++) {
        var marker = new google.maps.Marker({
            position: locations[i],
            map: map,
            title: namelist[i],
            animation: google.maps.Animation.DROP
        });
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {

                var infowindow = new google.maps.InfoWindow({
                    content: '<h6>' + namelist[i] + '</h6>' +
                        '<p> Slots available : ' + availablelist[i] + '</p>'
                });
                infowindow.open(map, marker);
                map.setZoom(16);
                map.setCenter(marker.position);
            }
        })(marker, i));
    }
}

function clearMarkers() {
    document.getElementById("map").innerHTML = "";
    locations = [];
    markers = [];
    namelist = [];
    availablelist = [];
    idlist = [];
}


function sorttable() {
    var sort = document.getElementById('myList');
    var strSel = sort.options[sort.selectedIndex].value;

    if (strSel != "") {
        clearMarkers();
        for (var i = 0; i < locations.length; i++) {
            locations.pop();
        }

        let element = document.getElementById("posts");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        var db = firebase.firestore();

        db.collection("location").where("type", "==", strSel).get().then((data) => {
            data.forEach((data) => {

                var location = data.data()["name"];

                document.getElementById('posts').innerHTML += `
                <tr style="text-align: center;" onclick="locClick('${location}')">
                <td>${data.data()["name"]}</td>
                <td>${data.data()["address"]}</td>
                <td>${data.data()["available"]}</td>
                </tr>`;

                locations.push(new google.maps.LatLng({ lat: parseFloat(data.data()["latitude"]), lng: parseFloat(data.data()["longitude"]) }));
                namelist.push(data.data()["name"]);
                availablelist.push(data.data()["available"]);
            });
        }).catch((error) => {
            console.log(error);
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition); //position.coords.latitude, position.coords.longitude  variables for getting cooordinates
        } else {
            alert("geo location is not suported by your browser");
        }

    } else {
        clearMarkers();
        let element = document.getElementById("posts");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        loadlocation();
    }
}

function locClick(loc) {
    document.cookie = "location=" + loc + ";path=/";
    window.location = "../slot/";
}