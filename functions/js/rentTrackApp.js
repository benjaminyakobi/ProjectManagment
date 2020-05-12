window.onload = function() {
    initApp();
  };

function initApp()
{

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
    var json={
        app:1
    };

    function hasImg() {
        console.log("hasIMg");
          if(true){
              return "/images/compact_camera.png";

            /*      var x = document.createElement("IMG");
                  x.setAttribute("images", "compact_camera.png");
                  x.setAttribute("width", "25");
                  x.setAttribute("height", "25");
                  x.setAttribute("alt", "The Pulpit Rock");

                  document.body.appendChild(x);*/

          }
      }



    
fetch("/renterLease", {
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
           
                
                 // let url = await firebase.storage().ref('profileImages/'+obj.id +'/profile.png').getDownloadURL();
                 // console.log(url);
                  sss.innerHTML+= '<tl>'+
                  '<td><a href="#">' +obj.unitId+ '</a></td>'+
                  '<td><a href="#">' +obj.data.firstName+ '</a></td>'+
                  '<td><a href="#">' +obj.data.lastName+ '</a></td>'+
                  '<td><a href="#">' +obj.data.email+ '</a></td>'+
                  '<td><a href="#">' +obj.data.phoneNumber+ '</a></td>'+
                  '<td><a href="#">' +obj.data.startDate+ '</a></td>'+
                  '<td><a href="#">' +obj.data.endDate+ '</a></td>'+
                  '<td><a href="#">' +obj.data.Bill+ '</a></td>'+
                  '<td><button value ='+obj.id+' onclick="Approved(this)">V</button><button value ='+obj.id+' onclick="Declined(this)">X</button></td>'+
                '</tl>';
               
            


        }


    }).catch(function (error) {
      console.log('data error');
    });


    //-------------------+fake names+---------------------
    const f1= function()
    {
     
        for(i =0;i<10 ;i++)
        {
            sss.innerHTML+= '<tr>'+
                            '<td >First name</td>'+
                            '<td >last name</td>'+
                            '<td >Email</td>'+
                            '<td >Phone Number</td>'+
                            '<td >starting date</td>'+
                            '<td >ending date</td>'+
                            '<td >Billing overall</td>'+
                            '<td><button onclick="Approved()">V</button><button onclick="Declined">X</button></td>'+
                            '</tr>';
        }
    }
    f1();

}
//-------------end init





    function Approved(objec){
        
       fetch("/renterLease", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify({uid:objec.value,flag:"true"}),
            })
        .then(response => response.json())
        // eslint-disable-next-line prefer-arrow-callback
        .then(function(resJ){
            console.log(resJ.data);
            alert("Contract accepted");
        }).catch(function (error) {
            console.log('data error');
        });
    }



    //--------------------------------


    function Declined(objec){
        fetch("/renterLease", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify({uid:objec.value,flag:"false"}),
            })
            .then(response => response.json())
            // eslint-disable-next-line prefer-arrow-callback
            .then(function(resJ){
                console.log(resJ.data);
                alert("Contract declined");    
            }).catch(function (error) {
                console.log('data error');
            });
    }


//const signOutButton = document.getElementById("signOutButton");

//signOutButton.onclick = function(){




    function hasImg() {
        console.log("hasIMg");
          if(true){
              return "/images/compact_camera.png";

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

