/* eslint-disable promise/always-return */
//import { response } from "express";

/* eslint-disable eqeqeq */
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
  /*  firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log('logged');
        } else {
            // No user is signed in.
            console.log('no logged');
        }
    });*/
  function hasImg(val) {
    if (val)
      return "/images/compact_camera.png";
    return "";
  }
  
  
  

  fetch("/rU", {
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
        for(var i = 0; i < resJ.data.length; i++) {
          var obj = resJ.data[i];
              sss.innerHTML+= '<tl>'+
                                '<td><a href="#">' +obj.location+ '</a></td>'+
                                '<td><a href="#">' +obj.rooms+ '</a></td>'+
                                '<td><a href="#">' +obj.price+ '</a></td>'+        
                                '<td><a href="#">' +obj.rating+ '</a></td>'+                     
                                '<td><a href="#">' +obj.ownerName+ '</a></td>'+ 
                                '<td><a href="#">' +obj.startDate+ '</a></td>'+ 
                                '<td><a href="#">' +obj.endDate+ '</a></td>'+ 
                                '<td><a href="#">' +obj.phoneNumber+ '</a></td>'+
                                '<td><a href="#"><img src="'+hasImg(obj.hasPictures)+'"></a></td>'+
                              '</tl>';
          }
          addRowHandlers();
    }).catch(function (error) {
      console.log('data error');
    });
  

   
    function sortTable(jsonInfo){ 
      fetch("/rU", {
      method: "POST",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "CSRF-Token": Cookies.get("XSRF-TOKEN"),
      },
      body: JSON.stringify(jsonInfo),
      })
      .then(response => response.json())
      // eslint-disable-next-line prefer-arrow-callback
      .then(function(resJ){
          for(var i = 0; i < resJ.data.length; i++) {
            var obj = resJ.data[i];
  
  
                sss.innerHTML+= '<tl>'+
                                  '<td><a href="#">' +obj.location+ '</a></td>'+
                                  '<td><a href="#">' +obj.rooms+ '</a></td>'+
                                  '<td><a href="#">' +obj.price+ '</a></td>'+        
                                  '<td><a href="#">' +obj.rating+ '</a></td>'+                     
                                  '<td><a href="#">' +obj.ownerName+ '</a></td>'+ 
                                  '<td><a href="#">' +obj.startDate+ '</a></td>'+ 
                                  '<td><a href="#">' +obj.endDate+ '</a></td>'+ 
                                  '<td><a href="#">' +obj.phoneNumber+ '</a></td>'+
                                  '<td><a href="#"><img src="'+hasImg(obj.hasPictures)+'"></a></td>'+
                                '</tl>';
            }
          
  
      }).catch(function (error) {
        console.log('data error');
      });

    }
  const sss = document.getElementById("myTable");
  
}


// When the user clicks on <span> (x), close the modal

function addRowHandlers() {
  var table = document.getElementById("myTable");
  var rows = table.getElementsByTagName("tl");
  console.log(rows.length);
  for (i = 1; i < rows.length+1; i++) {
      var currentRow = table.rows[i];
      var createClickHandler = 
          function(row) 
          {
              return function() { 
                                      var cell = row.getElementsByTagName("a")[0];
                                      var id = cell.innerHTML;
                                      var cell1 = row.getElementsByTagName("a")[1];
                                      var id2 = cell1.innerHTML;
                                      // window.prompt("Copy to clipboard: Ctrl+C, Enter", "<table><tr><td>" + id + "</td><td>" + id2 + "</td></tr></table>")
                                      var modal = document.getElementById("myModal");
                                      var modal2 = document.getElementById("modalUnits");
                                      var span = document.getElementsByClassName("close")[0];
                                      span.onclick = function() {
                                        modal.style.display = "none";
                                      }
                                      window.onclick = function(event) {
                                        if (event.target == modal) {
                                            modal.style.display = "none";

                                        }
                                    }
                                      modal.style.display = "block";
                                      modal2.style.display = "block";
                                      
                                      fillInformation(row.getElementsByTagName("a"));
                               };
                                      
          };

      currentRow.onclick = createClickHandler(currentRow);
  }
}
function fillInformation(id){
  document.getElementById("locationModal").value = id[0].innerHTML;
  document.getElementById("roomzModal").value = id[1].innerHTML;
  document.getElementById("priceModal").value = id[2].innerHTML;
  document.getElementById("ratingModal").value = id[3].innerHTML;
  document.getElementById("ownerNameModal").value = id[4].innerHTML;
  document.getElementById("startDateModal").value = id[5].innerHTML;
  document.getElementById("endDateModal").value = id[6].innerHTML;
  document.getElementById("phoneNumberModal").value = id[7].innerHTML;
}


function searchFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("a");
      tr[i].style.display ="none";
      for(var j = 0; j <td.length;j++){
        if(td[j].innerHTML.toUpperCase().indexOf(filter)>-1){
          tr[i].style.display = "";
          continue;
        }
      }
    }  
}


var sortUpOrDown = 'dec';
function sortUp(columnName){
  console.log("up");
  sortUpOrDown = 'dec';
  return {columnName:sortUpOrDown};
}

function sortDown(columnName){
  console.log("down");
  sortUpOrDown = 'inc';
  return {columnName:sortUpOrDown};
}