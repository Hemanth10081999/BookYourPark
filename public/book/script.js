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

    document.getElementById('bookbutton').disabled = true;
    document.getElementById('payment').hidden = true;

    slot = getCookie('slot');
    loc = getCookie('location');
    fetch('http://localhost:8080/api/locations/' + loc)
        .then((res) => res.json())
        .then(posts => {


            document.getElementById('locname').innerHTML = posts.locName;
            document.getElementById('locaddress').innerHTML = posts.locAddress + "," + posts.locCity;

        })
        .catch((err) => {
            console.log(err);
        });


    fetch('http://localhost:8080/api/slotdetails/' + slot)
        .then((res) => res.json())
        .then(posts => {

            document.getElementById('slotdetail').innerHTML = posts.name;
            document.getElementById('value').innerHTML = posts.value;

            document.cookie = "sid=" + posts.id + ";path=/";
            document.cookie = "stype=" + posts.type + ";path=/";
            document.cookie = "svalue=" + posts.value + ";path=/";
            document.cookie = "sname=" + posts.name + ";path=/";
            document.cookie = "sfloor=" + posts.floor + ";path=/";
            document.cookie = "stime=" + posts.time + ";path=/";

        })
        .catch((err) => {
            console.log(err);
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
    var getid = getCookie('id');


    fetch('http://localhost:8080/api/vehicles/login/' + getid)
        .then(response => response.json())
        .then(posts => {
            posts.forEach(p => {
                console.log(p.number, p.name)
                document.cookie = "vehicle=" + p.id + ";path=/";
                if (p.type == getCookie('stype')) {
                    var ne = p.name + ' ' + p.number;
                    document.getElementById('myList').innerHTML += `
                        <option value = "${p.number}">${ne}</option>
                        `;
                }
                console.log(p.title)
            })
        })
        .catch((err) => {
            console.log(err);
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
    } else {
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
        document.getElementById('pay').innerHTML = `${amount}`;
        document.getElementById('bookbutton').disabled = false;
    }
}


function book() {

    var dt1 = new Date(document.getElementById('fromTime').value);
    var dt2 = new Date(document.getElementById('toTime').value);
    var vehicle = getCookie('vehicle');
    var slot = getCookie('slot');

    const url = 'http://localhost:8080/api/parkings';
    const data = {
        'inTime': dt1,
        'outTime': dt2,
        'vehicle': {
            'id': vehicle
        },
        'slotdetails': {
            'id': slot
        }
    };
    console.log('' + JSON.stringify(data));
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    .then(response => response.json())
        .then(data => {

            //new code
            //alert("it might work");
            var sname = getCookie('sname');
            var stype = getCookie('stype');
            var sfloor = getCookie('sfloor');
            var svalue = getCookie('svalue');
            var stime = getCookie('stime');
            var sid = getCookie('sid');

            document.cookie = "parked=true;path=/";

            const Data = {
                url: 'http://localhost:8080/api/slotdetails/' + sid,
                data: {
                    "name": sname,
                    "floor": sfloor,
                    "availability": false,
                    "type": stype,
                    "time": stime,
                    "value": svalue
                }
            };

            putData(Data.url, Data.data)

            .then(data => { window.location.href = "../outpark/index.html" })
                .catch(error => console.error(error));




            //new code
        })
        .catch(error => console.error(error));

}

function postData(url = '', data = {}) {
    console.log('posting starts');
    return fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrer: 'no-refrrer',
            body: JSON.stringify(data),
        })
        .then(response => response.json());
}


function putData(url = '', data = {}) {
    console.log('posting starts');
    return fetch(url, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrer: 'no-refrrer',
            body: JSON.stringify(data),
        })
        .then(response => response.json());
}