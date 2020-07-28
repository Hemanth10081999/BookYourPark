
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
    if (mailid != "") {
        if (getCookie("parked") != "") {
            window.location = "../outpark";
        }
        else {
            window.location = "../location";
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

function handleClick() {
    const name = document.getElementById('inputName').value;
    const email = document.getElementById('inputEmail').value;
    const phone = document.getElementById('inputPhone').value;
    const password = document.getElementById('inputPassword').value;
    const repassword = document.getElementById('rePassword').value;

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ".000";
    var dateTime = date + '-' + time;

    if (name.length < 3 || name.length > 20) {
        console.log("user name should be with in 4 to 20 characters")
        alert("user name should be with in 4 to 20 characters");
    }
    else {
        if (password != repassword) {
            console.log('pasword mismatch');
            alert("password mismatch");
        }
        else {
            var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
            if (password.match(decimal)) {

                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }

                var db = firebase.firestore();
                db.collection("user").doc(email).get().then((data) => {
                    if (data.exists) {
                        alert("User email already exists");
                    } else {
                        db.collection("user").doc(email).set({
                            'userName': name,
                            'mailid': email,
                            'phone': phone,
                            'password': password,
                            'createDate': dateTime
                        })
                            .then(function (docRef) {
                                document.cookie = "userName=" + name + ";path=/";
                                document.cookie = "mailid=" + email + ";path=/";
                                document.cookie = "password=" + password + ";path=/";
                                document.cookie = "createDate=" + dateTime + ";path=/";
                                document.cookie = "phone=" + phone + ";path=/";
                                window.location = "../location/";
                            })
                            .catch(function (error) {
                                console.log(error);
                                alert("Error ocuured during registration");
                            });
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
            else {
                alert("password must contain 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character");
            }
        }
    }
}

function loginClick() {
    const email = document.getElementById('logEmail').value;
    const password = document.getElementById('logPassword').value;

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();

    db.collection("user").doc(email).get().then((data) => {
        if (data.exists) {
            db.collection("user").doc(email).get().then((data) => {
                if(password == data.data()['password']){
                    document.cookie = "userName=" + data.data()['userName'] + ";path=/";
                    document.cookie = "mailid=" + data.data()['mailid'] + ";path=/";
                    document.cookie = "password=" + data.data()['password'] + ";path=/";
                    document.cookie = "createDate=" + data.data()['createDate'] + ";path=/";
                    document.cookie = "phone=" + data.data()['phone'] + ";path=/";
                    window.location = "../location/";
                }else{
                    alert("Incorrect password");
                }
            }).catch(() => {
                alert("Error occured during login");
            });
        } else {
            alert("Login doesnt exist, Recheck email");
        }
    }).catch((error) => {
        console.log(error);
    });
}

function checklogmail() {
    var decimal = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const element = document.getElementById('logEmail');
    const email = element.value;
    if (email.match(decimal)) {
        document.getElementById('alertemail').innerHTML = ``;
        document.getElementById('logbutton').disabled = false;
    }
    else {
        document.getElementById('alertemail').innerHTML = `enter valid email`;
        document.getElementById('logbutton').disabled = true;
    }
}

function checkregmail() {
    var decimal = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const element = document.getElementById('inputEmail');
    const email = element.value;
    if (email.match(decimal)) {
        document.getElementById('alertregmail').innerHTML = ``;
        document.getElementById('sign').disabled = false;
    }
    else {
        document.getElementById('alertregmail').innerHTML = `enter valid email`;
        document.getElementById('sign').disabled = true;
    }
}


function checkregname() {
    var decimal = /^[a-z0-9_-]{3,15}$/;
    const element = document.getElementById('inputName');
    const email = element.value;
    if (email.match(decimal)) {
        document.getElementById('alertregname').innerHTML = ``;
        document.getElementById('sign').disabled = false;
    }
    else {
        document.getElementById('alertregname').innerHTML = `Username must be lowercase and have atleast 3 letters`;
        document.getElementById('sign').disabled = true;
    }
}

function checkregphone() {
    var decimal = /^[2-9]{2}[0-9]{8}$/;
    const element = document.getElementById('inputPhone');
    const email = element.value;
    if (email.match(decimal)) {
        document.getElementById('alertregphone').innerHTML = ``;
        document.getElementById('sign').disabled = false;
    }
    else {
        document.getElementById('alertregphone').innerHTML = `10 digit mobile number need to be entered`;
        document.getElementById('sign').disabled = true;
    }
}

function checkregpass() {
    var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    const element = document.getElementById('inputPassword');
    const email = element.value;
    if (email.match(decimal)) {
        document.getElementById('alertregpass').innerHTML = ``;
        document.getElementById('sign').disabled = false;
    }
    else {
        document.getElementById('alertregpass').innerHTML = `Password must have one uppercase, one number and one special character`;
        document.getElementById('sign').disabled = true;
    }
}

function checkregconf() {
    const confirm = document.getElementById('inputPassword');
    const conf = confirm.value;
    const element = document.getElementById('rePassword');
    const email = element.value;
    if (email == conf) {
        document.getElementById('alertregconf').innerHTML = ``;
        document.getElementById('sign').disabled = false;
    }
    else {
        document.getElementById('alertregconf').innerHTML = `Password not maching`;
        document.getElementById('sign').disabled = true;
    }
}