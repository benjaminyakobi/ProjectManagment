/* eslint-disable promise/always-return */
/* eslint-disable no-constant-condition */
window.onload = function () {
    initApp();
};

function initApp() {

    // Set the configuration for your app
    // TODO: Replace with your project's config object

    var config = {
        apiKey: "AIzaSyDwIvIUQ02UrYTeJ_H96jW49NaQkXMTBVc",
        authDomain: "projectmanagement-612b8.firebaseapp.com",
        databaseURL: "https://projectmanagement-612b8.firebaseio.com/",
        projectId: "projectmanagement-612b8",

    };
    firebase.initializeApp(config);

    const database = firebase.database();
    const auth = firebase.auth();
    const sss = document.getElementById("myTable");
    var json = {
        app: 1
    };

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log('logged');
        } else {
            // No user is signed in.
            console.log('no logged');
        }
    });
    function hasImg() {
        console.log("hasIMg");
        if (true) {
            return "https://firebasestorage.googleapis.com/v0/b/projectmanagement-612b8.appspot.com/o/icons%2Fcompact_camera.png?alt=media&token=e23f870d-4f38-4e92-a4fb-d3eddffd65da";

            /*      var x = document.createElement("IMG");
                  x.setAttribute("images", "compact_camera.png");
                  x.setAttribute("width", "25");
                  x.setAttribute("height", "25");
                  x.setAttribute("alt", "The Pulpit Rock");

                  document.body.appendChild(x);*/

        }
    }




    /* fetch("/requestAuth", {
       method: "POST",
       headers: {
           Accept: "application/json",
           "Content-Type": "application/json",
           "CSRF-Token": Cookies.get("XSRF-TOKEN"),
       },
       body: JSON.stringify({}),
       })
       .then(response => response.json())
       // eslint-disable-next-line prefer-arrow-callback
       .then(function(resJ){
           console.log(resJ.data);
           // eslint-disable-next-line promise/always-return
           
           for(var i = 0; i < resJ.data.length; i++) {
             var obj = resJ.data[i];
             
             // eslint-disable-next-line no-loop-func
             (async () => {
                   try {
                    // let url = await firebase.storage().ref('profileImages/'+obj.id +'/profile.png').getDownloadURL();
                    // console.log(url);
                     sss.innerHTML+= '<tl>'+
                     '<td><a href="#">' +obj.id+ '</a></td>'+
                     '<td><a href="#">' +obj.data.firstName+ '</a></td>'+
                     '<td><a href="#">' +obj.data.lastName+ '</a></td>'+
                     '<td><a href="#"><img src="'+obj.data.profileUrl+'"></a></td>'+
                     '<td><button value ='+obj.id+' onclick="accept(this)">V</button><button value ='+obj.id+' onclick="decline(this)">X</button></td>'+
                   '</tl>';
                   } catch (error) {
                       console.log(error);
                   }
               })();
   
   
           }
             
   
       }).catch(function (error) {
         console.log('data error');
       });*/
    /*  const getRequests =  firebase.functions().httpsCallable('api/adminR');
      getRequests().then( res =>
      {
          console.log(res.data);
          console.log(res.data[0]);
          console.log("got data");
  
          for(i =0;i<res.data.length ;i++)
          {
              sss.innerHTML+= '<tr>'+
                              '<td>' +res.data[i].name+ '</td>'+
                              '<td>Germany</td>'+
                              '<td>3</td>'+
                              '<td><img src="'+hasImg()+'"></td>'+
                              '</tr>';
          }
      })
      .catch(function (error) {
          console.log('data error');
      });*/

    /*const f1= function()
    {
     
        for(i =0;i<10 ;i++)
        {
            sss.innerHTML+= '<tr>'+
                            '<td>firstName</td>'+
                            '<td>LastName</td>'+
                            '<td><img src="'+hasImg()+'"></td>'+
                            '<td><button onclick="accept()">V</button><button onclick="decline">X</button></td>'+
                            '</tr>';
        }
    }
    f1();*/

    /*  var l = [123,123,123,1,231,23,123]
      var l2 = ['adasd','asdas'];
      const createUnit =  firebase.functions().httpsCallable('createUnit');
           createUnit({
                  
              }).then( () =>
              {
                  console.log("ok");
              })
              .catch(function (error) {
                  console.log('error')
              });*/

    // Get a reference to the database service

}
//-------------end init





function accept(objec) {

    fetch("/adminRequest", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "CSRF-Token": Cookies.get("XSRF-TOKEN"),
        },
        body: JSON.stringify({ uid: objec.value, flag: "true" }),
    })
        .then(response => response.json())
        // eslint-disable-next-line prefer-arrow-callback
        .then(function (resJ) {
            console.log(resJ.data);
            alert("accepted");
        }).catch(function (error) {
            console.log('data error');
        });
    location.reload();

}



//--------------------------------


function decline(objec) {
    fetch("/adminRequest", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "CSRF-Token": Cookies.get("XSRF-TOKEN"),
        },
        body: JSON.stringify({ uid: objec.value, flag: "false" }),
    })
        .then(response => response.json())
        // eslint-disable-next-line prefer-arrow-callback
        .then(function (resJ) {
            console.log(resJ.data);
            alert("declined");
        }).catch(function (error) {
            console.log('data error');
        });
    location.reload();
}


//const signOutButton = document.getElementById("signOutButton");

//signOutButton.onclick = function(){




function hasImg() {
    console.log("hasIMg");
    if (true) {
        return "https://firebasestorage.googleapis.com/v0/b/projectmanagement-612b8.appspot.com/o/icons%2Fcompact_camera.png?alt=media&token=e23f870d-4f38-4e92-a4fb-d3eddffd65da";

    }
}


function myFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

