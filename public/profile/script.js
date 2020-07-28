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

function logout() {
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "mailid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "createDate=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "phone=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location = "../home/index.html";
}

function initial() {
    findcookie();
    var getusername = getCookie('userName');
    document.getElementById('nameboard').innerHTML = `${getusername}`;
    var email = getCookie('mailid');

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();

    db.collection("user").doc(email).get().then((data) => {
        if (data.exists) {
            document.getElementById('inputfirstname').defaultValue = data.data()['userName'];
            document.getElementById('inputlastname').defaultValue = data.data()['lastName'] == undefined ? "" : data.data()['lastName'];
            document.getElementById('dob').defaultValue = data.data()['dob'] == undefined ? "" : data.data()['dob'];
            document.getElementById('inputcompanyname').defaultValue = data.data()['companyName'] == undefined ? "" : data.data()['companyName'];
            document.getElementById('inputaddress').defaultValue = data.data()['address'] == undefined ? "" : data.data()['address'];
            document.getElementById('inputcity').defaultValue = data.data()['city'] == undefined ? "" : data.data()['city'];
            document.getElementById('inputpin').defaultValue = data.data()['pin'] == undefined ? "" : data.data()['pin'];

            if(data.data()['picurl'] != undefined){
                document.getElementById('pic').src = data.data()['picurl'];
            }
            
            document.getElementById('inputfirstname').disabled = true;
            document.getElementById('inputlastname').disabled = true;
            document.getElementById('dob').disabled = true;
            document.getElementById('inputcompanyname').disabled = true;
            document.getElementById('inputaddress').disabled = true;
            document.getElementById('inputcity').disabled = true;
            document.getElementById('inputpin').disabled = true;
            document.getElementById('update').disabled = false;
            document.getElementById('save').disabled = true;
        } else {
            alert("Error occured, Try again later");
        }
    })
        .catch((error) => {
            console.log(error);
            alert("Error occured, Try again later");
        });
}


function modify() {
    document.getElementById('save').disabled = false;
    document.getElementById('inputfirstname').disabled = false;
    document.getElementById('inputlastname').disabled = false;
    document.getElementById('dob').disabled = false;
    document.getElementById('inputcompanyname').disabled = false;
    document.getElementById('inputaddress').disabled = false;
    document.getElementById('inputcity').disabled = false;
    document.getElementById('inputpin').disabled = false;
    document.getElementById('update').disabled = true;
}

function savefunction() {
    var email = getCookie('mailid');

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();

    const firstname = document.getElementById('inputfirstname').value;
    const lastname = document.getElementById('inputlastname').value;
    const d_o_b = document.getElementById('dob').value;
    const company = document.getElementById('inputcompanyname').value;
    const address = document.getElementById('inputaddress').value;
    const city = document.getElementById('inputcity').value;
    const pin = document.getElementById('inputpin').value;

    db.collection("user").doc(email).update({
        'userName': firstname,
        'lastName': lastname,
        'dob': d_o_b,
        'companyName': company,
        'address': address,
        'city': city,
        'pin': pin,
    }).then((data) => {
        initial();
    }).catch((error) => {
        console.error(error);
        alert("Some error occured during save, Try again later");
    });
}

function uploadFile() {
    var file = document.getElementById('file-upload-field').files[0];
    if (file == undefined) {
        alert("Select a file");
    } else {
        console.log(file.name);
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        var storageRef = firebase.storage().ref('user/' + getCookie("mailid"));
        var task = storageRef.put(file);
        task.on('state_changed', function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(percentage);
        }, function error(err) {
            console.log(err);
        }, function complete() {
            console.log("success");
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                var email = getCookie('mailid');
                var db = firebase.firestore();
                db.collection("user").doc(email).update({
                    'picurl': downloadURL,
                }).then((data) => {
                    initial();
                }).catch((error) => {
                    console.error(error);
                    alert("Some error occured during save, Try again later");
                });
            });
        });
    }
}