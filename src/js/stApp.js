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
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log('logged');
        } else {
            // No user is signed in.
            console.log('no logged');
        }
    });
    function hasImg(val) {
          if(val)
              return "https://firebasestorage.googleapis.com/v0/b/projectmanagement-612b8.appspot.com/o/icons%2Fcompact_camera.png?alt=media&token=e23f870d-4f38-4e92-a4fb-d3eddffd65da";
          return "";
      }

    var locationSortBtn = document.getElementById("locationCol");
    function sortAlph() {
    var list, i, switching, b, shouldSwitch, dir, switchcount = 0;
    list = document.getElementById("id01");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc"; 
    // Make a loop that will continue until no switching has been done:
    while (switching) {
      // start by saying: no switching is done:
      switching = false;
      b = list.getElementsByTagName("LI");
      // Loop through all list-items:
      for (i = 0; i < (b.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /* check if the next item should switch place with the current item,
        based on the sorting direction (asc or desc): */
        if (dir == "asc") {
          if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
            /* if next item is alphabetically lower than current item,
            mark as a switch and break the loop: */
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (b[i].innerHTML.toLowerCase() < b[i + 1].innerHTML.toLowerCase()) {
            /* if next item is alphabetically higher than current item,
            mark as a switch and break the loop: */
            shouldSwitch= true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;
        // Each time a switch is done, increase switchcount by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }
  
    

    const addUserRecords =  firebase.functions().httpsCallable('api/rU');
    addUserRecords().then( res =>
    {
        console.log(res.data);
        console.log(res.data[0]);
        console.log("got data");

        for(i =0;i<res.data.length ;i++)
        {
          
            sss.innerHTML+= '<tr>'+
                            '<td>' +res.data[i].location+ '</td>'+
                            '<td>' +res.data[i].rooms+ '</td>'+
                            '<td>' +res.data[i].price+ '</td>'+                         
                            '<td>' +res.data[i].ownerName+ '</td>'+ 
                            '<td>' +res.data[i].phoneNumber+ '</td>'+
                            '<td><img src="'+hasImg(res.data[i].hasPictures)+'"></td>'+
                            '</tr>';
        }
    })
    .catch(function (error) {
        console.log('data error');
    });
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

    const database = firebase.database();
    const auth = firebase.auth();
    const sss = document.getElementById("myTable");
    var json={
        app:1
    };

  }
 
    

//const signOutButton = document.getElementById("signOutButton");

//signOutButton.onclick = function(){







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

