function out(){
    var sname=getCookie('sname');
    var stype=getCookie('stype');
    var sfloor=getCookie('sfloor');
    var svalue=getCookie('svalue');
    var stime=getCookie('stime');
    var sid=getCookie('sid');

    document.cookie = "parked=true;path=/";  

    const Data={
      url: 'http://localhost:8080/api/slotdetails/'+sid,
      data: {
        "name": sname,
        "floor": sfloor,
        "availability": true,
        "type": stype,
        "time": stime,
        "value": svalue
      }
  };

  putData(Data.url,Data.data)

  .then(data=>{ window.location.href="../thankyou/index.html"})
  .catch(error=>console.error(error));
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
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

  function putData(url='',data={}){
    console.log('posting starts');
    return fetch(url,{
        method:'PUT',
        mode:'cors',
        cache: 'no-cache',
        credentials:'same-origin',
        headers:{
            'Content-Type':'application/json',
        },
        redirect:'follow',
        referrer: 'no-refrrer',
        body: JSON.stringify(data),
    })
    .then(response => response.json());
  }