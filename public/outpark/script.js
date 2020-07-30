function out() {
  var sname = getCookie('sname');
  var stype = getCookie('stype');
  var sfloor = getCookie('sfloor');
  var svalue = getCookie('svalue');
  var stime = getCookie('stime');
  var sid = getCookie('sid');

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  var db = firebase.firestore();
  db.collection("location").doc(getCookie('location')).collection('slots').doc(getCookie('slot')).update({
    "availability": true
  }).then((data) => {
    document.cookie = "parked=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "../thankyou";
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