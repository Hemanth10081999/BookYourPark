var firebaseConfig = {
    apiKey: "AIzaSyBANZCmMMwdxBEWU8nMdhMxfP25P_u_34A",
    authDomain: "bookyourpark.firebaseapp.com",
    databaseURL: "https://bookyourpark.firebaseio.com",
    projectId: "bookyourpark",
    storageBucket: "bookyourpark.appspot.com",
    messagingSenderId: "197640546163",
    appId: "1:197640546163:web:24d9b5866cd1e280674706"
};

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

function logout() {
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "mailid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "createDate=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "phone=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location = "../login";
}

function initial() {
    findcookie();
    let element = document.getElementById("posts");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();
    var email = getCookie('mailid');

    db.collection("user").doc(email).collection("vehicle").get().then((data) => {
        var x = 1;
        data.forEach((vehicle) => {
            document.getElementById('posts').innerHTML += `
            <tr>
            <td>${x++}</td>
            <td>${vehicle.data()["number"]}</td>
            <td>${vehicle.data()["name"]}</td>
            <td>${fixtype(vehicle.data()["type"])}</td>
            <td><i class="fas fa-file-excel" onclick="del('${vehicle.data()["name"]}')"></i> </td>
            </tr>`;
        });
    }).catch((error) => {
        console.error(error);
        alert("Some error occured during save, Try again later");
    });
}

function changetype(type) {
    if (type == "1") {
        return "Bike";
    } else if (type == "2") {
        return "Mini Car";
    } else if (type == "3") {
        return "Family Car";
    } else if (type == "4") {
        return "SUV";
    }
}

function fixtype(type) {
    if (type == "bike") {
        return "Bike";
    } else if (type == "minicar") {
        return "Mini Car";
    } else if (type == "familycar") {
        return "Family Car";
    } else if (type == "suv") {
        return "SUV";
    }
}

function del(name) {
    var email = getCookie('mailid');
    console.log(name);

    if (confirm("Data will be deleted Permenantly") == true) {
        var db = firebase.firestore();
        db.collection("user").doc(email).collection("vehicle").doc(name).delete().then((data) => {
            console.log("data deleted");
            initial();
        }).catch((error) => {
            console.error(error);
            alert("Some error occured during save, Try again later");
        });
    }
}

function add() {
    const name = document.getElementById('vehiclename').value;
    const number = document.getElementById('vehiclenumber').value;
    const color = document.getElementById('inputcolor').value;
    var sort = document.getElementById('myList');
    var strSel = sort.options[sort.selectedIndex].value;

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();
    var email = getCookie('mailid');

    db.collection("user").doc(email).collection("vehicle").doc(name).set({
        'name': name,
        'number': number,
        'color': color,
        'type': strSel,
    }).then((data) => {
        console.log("success");
        initial();
    }).catch((error) => {
        console.error(error);
        alert("Some error occured during save, Try again later");
    });
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