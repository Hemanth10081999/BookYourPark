function logout() {
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "mailid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "createDate=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "phone=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location = "../home/index.html";
}


var booklocation;
var namelist;


function loadslot() {
    loc = getCookie('location');
    document.cookie = "slot=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    fetch('http://localhost:8080/api/locations/' + loc)
        .then((res) => res.json())
        .then(posts => {

            document.getElementById('locname').innerHTML = posts.locName;
            document.getElementById('add').innerHTML = posts.locAddress;
            document.getElementById('city').innerHTML = posts.locCity + "-" + posts.locPin;
            document.getElementById('support').innerHTML = posts.locSupport;

            booklocation = new google.maps.LatLng({ lat: parseFloat(posts.latitude), lng: parseFloat(posts.longitude) });
            namelist = posts.locName;
        })
        .catch((err) => {
            console.log(err);
        });


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition); //position.coords.latitude, position.coords.longitude  variables for getting cooordinates

    } else {
        alert("geo location is not suported by your browser");
    }


    fetch('http://localhost:8080/api/locations/' + loc)
        .then((res) => res.json())
        .then(posts => {
            let output = '';
            var x = 1;
            posts.slotdetails.forEach(p => {
                if (p.availability == true) {

                    document.getElementById('posts').innerHTML += `

            <tr onclick="locClick(${p.id})">
            <td>${x++}</td>
            <td>${p.name}</td>
            <td>${p.floor}</td>
            <td>${p.time}</td>
            <td>${p.value}</td>
            </tr>
            `;
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
}



function showPosition(position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    setTimeout(function() {
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

    google.maps.event.addListener(marker, 'click', (function(marker) {
        return function() {

        }
    })(marker));

}











function locClick(loc) {
    document.cookie = "slot=" + loc + ";path=/";
    window.location = "../book/index.html";
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













function sort() {
    var sort = document.getElementById('myList');
    var strSel = sort.options[sort.selectedIndex].value;
    console.log(strSel);

    let element = document.getElementById("posts");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    fetch('http://localhost:8080/api/locations/' + loc)
        .then((res) => res.json())
        .then(posts => {
            var x = 1;
            posts.slotdetails.forEach(p => {
                console.log(p.type);
                if (p.availability == true) {
                    if (strSel == 0) {
                        loadslot();
                    } else if (p.type == strSel) {

                        console.log(strSel);
                        document.getElementById('posts').innerHTML += `
            <tr onclick="locClick(${p.id})">
            <td>${x++}</td>
            <td>${p.name}</td>
            <td>${p.floor}</td>
            <td>${p.time}</td>
            <td>${p.value}</td>
            </tr>
            `;
                    }
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });

}