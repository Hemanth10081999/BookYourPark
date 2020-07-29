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
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "mailid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "createDate=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "phone=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location = "../login";
}

var booklocation;
var namelist;

function findcookie() {
    var mailid = getCookie("mailid");
    var location = getCookie("location");

    if (mailid == "") {
        window.location = "../login";
    } else {
        if (getCookie("parked") != "") {
            window.location = "../outpark";
        } else if(getCookie("location") == ""){
            window.location = "../location";
        }
    }
}

function loadslot() {
    findcookie();
    loc = getCookie('location');
    document.cookie = "slot=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();
    db.collection("location").doc(loc).get().then((data) => {

        document.getElementById('locname').innerHTML = data.data()["name"];
        document.getElementById('add').innerHTML = data.data()["address"];
        document.getElementById('city').innerHTML = data.data()["city"] + "-" + data.data()["pincode"];
        document.getElementById('support').innerHTML = data.data()["phone"];

        booklocation = new google.maps.LatLng({ lat: parseFloat(data.data()["latitude"]), lng: parseFloat(data.data()["longitude"]) });
        namelist = data.data()["name"];

    }).catch((error) => {
        console.error(error);
        alert("Some error occured, Try again later");
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition); //position.coords.latitude, position.coords.longitude  variables for getting cooordinates
    } else {
        alert("geo location is not suported by your browser");
    }

    db.collection("location").doc(loc).collection("slots").where("availability", "==", true).get().then((data) => {
        var x = 1;
        data.forEach((data) => {
            document.getElementById('posts').innerHTML += `
            <tr onclick="locClick('${data.data()["name"]}')">
            <td>${x++}</td>
            <td>${data.data()["name"]}</td>
            <td>${data.data()["floor"]}</td>
            <td>${data.data()["value"]}</td>
            </tr>`;
        });
    }).catch((error) => {
        console.error(error);
        alert("Some error occured, Try again later");
    });
}

function showPosition(position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    setTimeout(function () {
        initMaps(position.coords.latitude, position.coords.longitude);
    }, 3000);
}

function initMaps(latitude, longitude) {
    var newlatitude = latitude.toFixed(6);
    var newlongitude = longitude.toFixed(6);
    var mapProp = {
        center: booklocation,
        zoom: 16,
    };
    var map = new google.maps.Map(document.getElementById("map"), mapProp);
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    var marker = new google.maps.Marker({ position: new google.maps.LatLng(parseFloat(newlatitude), parseFloat(newlongitude)), map: map, title: "Your location", icon: image });
    var marker = new google.maps.Marker({
        position: booklocation,
        map: map,
        title: namelist,
        animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(marker, 'click', (function (marker) {
        return function () {
        }
    })(marker));
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

function typeCheck(type) {
    if (type == "1") {
        return "bike";
    } else if (type == "2") {
        return "minicar";
    } else if (type == "3") {
        return "familycar";
    } else if (type == "4") {
        return "suv";
    }
}

function sort() {
    var sort = document.getElementById('myList');
    var strSel = sort.options[sort.selectedIndex].value;

    let element = document.getElementById("posts");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    if (strSel == 0) {
        loadslot();
    } else {
        var type = typeCheck(strSel);
        var db = firebase.firestore();
        db.collection("location").doc(loc).collection("slots").where("availability", "==", true).where("type", "==", type).get().then((data) => {
            var x = 1;
            data.forEach((data) => {
                document.getElementById('posts').innerHTML += `
            <tr onclick="locClick('${data.data()["name"]}')">
            <td>${x++}</td>
            <td>${data.data()["name"]}</td>
            <td>${data.data()["floor"]}</td>
            <td>${data.data()["value"]}</td>
            </tr>`;
            });
        }).catch((error) => {
            console.error(error);
            alert("Some error occured, Try again later");
        });
    }
}

function locClick(loc) {
    document.cookie = "slot=" + loc + ";path=/";
    window.location = "../book";
}