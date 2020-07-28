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
    let element = document.getElementById("posts");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }


    var getid = getCookie('id');


    fetch('http://localhost:8080/api/vehicles/login/' + getid)

    .then((response) => response.json())
        .then(posts => {

            var x = 1;

            posts.map(p => {

                document.getElementById('posts').innerHTML += `

            <tr>
            <td>${x++}</td>
            <td>${p.number}</td>
            <td>${p.name}</td>
            <td>${changetype(p.type)}</td>
            <td><i class="fa fa-edit" onclick="edit(${p.id})"></i> </td>
            <td><i class="fas fa-file-excel" onclick="del(${p.id})"></i> </td>
            </tr>
            
            
            `;
                console.log(posts.title)
            })
        })
        .catch((err) => {
            console.log(err);
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


function edit(id) {

    console.log("edited");
}


function del(id) {

    if (confirm("Data will be deleted Permenantly") == true) {
        const Data = {
            url: 'http://localhost:8080/api/vehicles/' + id,
            data: {

            }
        };

        deleteData(Data.url, Data.data)

        .then(data => {
            initial();
        })

        //  .catch(error => console.error(error));
    }


}



function deleteData(url = '', data = {}) {
    console.log('posting starts');
    return fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrer: 'no-refrrer'
    })

    initial();
}





function add() {
    var getid = getCookie('id');

    const name = document.getElementById('vehiclename').value;
    const number = document.getElementById('vehiclenumber').value;
    const color = document.getElementById('inputcolor').value;
    var sort = document.getElementById('myList');
    var strSel = sort.options[sort.selectedIndex].value;




    const Data = {
        url: 'http://localhost:8080/api/vehicles',
        data: {
            "colour": color,
            "name": name,
            "number": number,
            "type": strSel,
            "login": getid
        }
    };

    postData(Data.url, Data.data)

    .then(data => {
        initial();
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