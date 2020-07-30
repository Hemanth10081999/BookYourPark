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

function findcookie() {
    var mailid = getCookie("mailid");

    if (mailid == "") {
        window.location = "../login";
    } else {
        if (getCookie("parked") != "") {
            window.location = "../outpark";
        } else if (getCookie("slot") == "") {
            window.location = "../location";
        }
    }
}

function initial() {
    findcookie();
    document.getElementById('bookbutton').disabled = true;
    document.getElementById('payment').hidden = true;
    document.getElementById('bookbutton').disabled = true;

    slot = getCookie('slot');
    loc = getCookie('location');
    var mail = getCookie('mailid');

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();
    db.collection("location").doc(loc).get().then((data) => {

        document.getElementById('locname').innerHTML = data.data()["name"];
        document.getElementById('locaddress').innerHTML = data.data()["address"] + "," + data.data()["city"];

    }).catch((error) => {
        console.error(error);
        alert("Some error occured, Try again later");
    });

    db.collection("location").doc(loc).collection("slots").doc(slot).get().then((data) => {
        document.getElementById('slotdetail').innerHTML = data.data()["name"];
        document.getElementById('value').innerHTML = data.data()["value"];

        document.cookie = "stype=" + data.data()["type"] + ";path=/";
        document.cookie = "svalue=" + data.data()["value"] + ";path=/";
        document.cookie = "sname=" + data.data()["name"] + ";path=/";
        document.cookie = "sfloor=" + data.data()["floor"] + ";path=/";
    }).catch((error) => {
        console.error(error);
        alert("Some error occured, Try again later");
    });

    var d = new Date();
    d.setHours(d.getHours() + 5);
    d.setMinutes(d.getMinutes() + 30);
    var n = d.toISOString().replace('Z', '');
    document.getElementById('fromTime').defaultValue = n;
    document.getElementById("fromTime").readOnly = true;

    var d1 = new Date();
    d1.setHours(d1.getHours() + 6);
    d1.setMinutes(d1.getMinutes() + 30);
    var n1 = d1.toISOString().replace('Z', '');
    document.getElementById('toTime').defaultValue = n1;
    document.getElementById("toTime").readOnly = true;


    db.collection("location").doc(loc).collection("slots").doc(slot).get().then((data) => {
        document.getElementById('slotdetail').innerHTML = data.data()["name"];
        document.getElementById('value').innerHTML = data.data()["value"];

        document.cookie = "stype=" + data.data()["type"] + ";path=/";
        document.cookie = "svalue=" + data.data()["value"] + ";path=/";
        document.cookie = "sname=" + data.data()["name"] + ";path=/";
        document.cookie = "sfloor=" + data.data()["floor"] + ";path=/";

        console.log(data.data()['type']);

        db.collection("user").doc(mail).collection("vehicle").where("type", "==", data.data()["type"]).get().then((data) => {
            data.forEach((data) => {
                var i = 1;
                var ne = data.data()["name"] + ' ' + data.data()["number"];
                document.getElementById('myList').innerHTML += `
                    <option value = "${i++}">${ne}</option>`;
            });
        }).catch((error) => {
            console.error(error);
            alert("Some error occured, Try again later");
        });

    }).catch((error) => {
        console.error(error);
        alert("Some error occured, Try again later");
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


function verify() {
    var sort = document.getElementById('myList');
    var strSel = sort.options[sort.selectedIndex].value;

    if (strSel == "0") {
        document.getElementById('alertregpass').innerHTML = `Select a vehicle that matches the slot type.`;
        document.cookie = "vehicle=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.getElementById('bookbutton').disabled = true;
    } else {
        document.cookie = "vehicle=" + sort.options[sort.selectedIndex].text + ";path=/";
        document.getElementById('alertregpass').innerHTML = ``;
        document.getElementById('payment').hidden = false;
        var sort1 = document.getElementById('intervallist');
        var interval = sort1.options[sort1.selectedIndex].value;
        console.log(interval, parseInt(interval));
        var d1 = new Date();
        d1.setHours(d1.getHours() + parseInt(interval) + 5);
        d1.setMinutes(d1.getMinutes() + 30);
        var n1 = d1.toISOString().replace('Z', '');
        document.getElementById('toTime').defaultValue = n1;
        document.getElementById("toTime").readOnly = true;
        var dt1 = new Date(document.getElementById('fromTime').value);
        var dt2 = new Date(document.getElementById('toTime').value);
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        var val = Math.abs(Math.round(diff));
        var value = getCookie('svalue');
        var amount = val * value;
        document.cookie = "amount=" + amount + ";path=/";
        document.getElementById('pay').innerHTML = `${amount}`;
        document.getElementById('bookbutton').disabled = false;
    }
}

function book() {

    var dt1 = new Date(document.getElementById('fromTime').value);
    var dt2 = new Date(document.getElementById('toTime').value);

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    var db = firebase.firestore();
    db.collection("history").doc().set({
        'email': getCookie('mailid'),
        'phone': getCookie('phone'),
        'location': getCookie('location'),
        'slot': getCookie('slot'),
        'floor': getCookie('sfloor'),
        'from': dt1,
        'to': dt2,
        'vehicle': getCookie('vehicle'),
        'payment': getCookie('amount')
    }).then((data) => {
        var db = firebase.firestore();
        db.collection("location").doc(getCookie('location')).collection('slots').doc(getCookie('slot')).update({
            "availability": false
        }).then((data) => {
            document.cookie = "parked=true;path=/";
            window.location.href = "../outpark";
        }).catch((error) => {
            console.error(error);
            alert("Some error occured, Try again later");
        });
    }).catch((error) => {
        console.error(error);
        alert("Some error occured, Try again later");
    });
}