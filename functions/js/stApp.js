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

    if (val > 0)
      return "/images/compact_camera.png";
    return "";
  }



  /*
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
            try{
            var obj = resJ.data[i];
                sss.innerHTML+= '<tl>'+
                                  '<td><a href="#">' +obj.data.location+ '</a></td>'+
                                  '<td><a href="#">' +obj.data.rooms+ '</a></td>'+
                                  '<td><a href="#">' +obj.data.price+ '</a></td>'+        
                                  '<td><a href="#">' +obj.data.rating+ '</a></td>'+                     
                                  '<td><a href="#">' +obj.data.ownerName+ '</a></td>'+ 
                                  '<td><a href="#">' +obj.data.startDate+ '</a></td>'+ 
                                  '<td><a href="#">' +obj.data.endDate+ '</a></td>'+ 
                                  '<td><a href="#">' +obj.data.phoneNumber+ '</a></td>'+
                                  '<td><a href="#"><img src="'+hasImg(obj.data.hasPictures)+'"></a></td>'+
                                '</tl>';
            }catch(error){console.log(error);}
            addRowHandlers();
          }
      }).catch(function (error) {
        console.log(error);
      });*/

  function fillInformation(id,uid) {
    document.getElementById("locationModal").value = id[0].innerHTML;
    document.getElementById("roomzModal").value = id[1].innerHTML;
    document.getElementById("priceModal").value = id[2].innerHTML;
    document.getElementById("ratingModal").value = id[3].innerHTML;
    document.getElementById("ownerNameModal").value = id[4].innerHTML;
    document.getElementById("startDateModal").value = id[5].innerHTML;
    document.getElementById("minDateModal").value = id[6].innerHTML;
    document.getElementById("endDateModal").value = id[7].innerHTML;
    document.getElementById("phoneNumberModal").value = id[8].innerHTML;
    document.getElementById("orderRef").href = "/order/"+uid;
  }
  function addRowHandlers() {
    var table = document.getElementById("tableBody");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
      var currentRow = table.rows[i];
      var createClickHandler =
        function (row) {
          return function () {
            // var cell = row.getElementsByTagName("a")[0];
            // var id = cell.innerHTML;
            // var cell1 = row.getElementsByTagName("a")[1];
            // var id2 = cell1.innerHTML;
            var modal = document.getElementById("myModal");
            var modal2 = document.getElementById("modalUnits");
            var modal3 = document.getElementById("modalOrder");
            var span = document.getElementsByClassName("close")[0];
            var bd = row.getElementsByTagName("button")[0];
            span.onclick = function () {
              modal.style.display = "none";
            }
            window.onclick = function (event) {
              if (event.target == modal) {
                modal.style.display = "none";

              }
            }
            modal.style.display = "block";
            modal2.style.display = "block";
            modal3.style.display = "none";
            fillInformation(row.getElementsByTagName("a"), bd.value);
          };

        };

      currentRow.onclick = createClickHandler(currentRow);
    }
  }
  addRowHandlers();
  changeToCurrectField();
  setToMin();
  const sss = document.getElementById("tableBody");
}


function changeToCurrectField() {
  var d = document.getElementById("fromFilter");
  while (d.length > 0) {
    console.log("removed");
    d.remove(d.length - 1);
  }
  var d2 = document.getElementById("toFilter");
  while (d2.length > 0) {
    console.log("removed");
    d2.remove(d2.length - 1);
  }
  var x = document.getElementById("filter").selectedIndex;
  if (x == 0) {
    for (index = 1; index < 12; index++) {
      var sel = document.getElementById("fromFilter");
      newOption = document.createElement("option");
      newOptionVal = document.createTextNode((index * 500));
      newOption.appendChild(newOptionVal);
      sel.insertBefore(newOption, sel.lastChild);
    }
  } else {
    for (index = 1; index < 6; index++) {
      var sel = document.getElementById("fromFilter");
      newOption = document.createElement("option");
      newOptionVal = document.createTextNode(index);
      newOption.appendChild(newOptionVal);
      sel.insertBefore(newOption, sel.lastChild);
    }
  }
}

function setToMin() {
  var d = document.getElementById("toFilter");
  while (d.length > 0) {
    console.log("removed");
    d.remove(d.length - 1);
  }
  var x = document.getElementById("filter").selectedIndex;
  index = document.getElementById("fromFilter").selectedIndex + 1;
  if (x == 0) {
    for (index; index < 12; index++) {
      var sel = document.getElementById("toFilter");
      newOption = document.createElement("option");
      newOptionVal = document.createTextNode((index * 500));
      newOption.appendChild(newOptionVal);
      sel.insertBefore(newOption, sel.lastChild);
    }
  } else {
    for (index; index < 6; index++) {
      var sel = document.getElementById("toFilter");
      newOption = document.createElement("option");
      newOptionVal = document.createTextNode(index);
      newOption.appendChild(newOptionVal);
      sel.insertBefore(newOption, sel.lastChild);
    }
  }
}

function sendRequestToServer(jsonInfo) {
  var sss = document.getElementById("tableBody");
  fetch("/requestUSort", {
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
    .then(function (resJ) {
      sss.innerHTML = "";
      for (var i = 0; i < resJ.data.length; i++) {
        var obj = resJ.data[i];
        try {
          sss.innerHTML += '<tl>' +
            '<td><a href="#">' + obj.data.location + '</a></td>' +
            '<td><a href="#">' + obj.data.rooms + '</a></td>' +
            '<td><a href="#">' + obj.data.price + '</a></td>' +
            '<td><a href="#">' + obj.data.rating + '</a></td>' +
            '<td><a href="#">' + obj.data.ownerName + '</a></td>' +
            '<td><a href="#">' + obj.data.startDate + '</a></td>' +
            '<td><a href="#">' + obj.data.minDate + '</a></td>' +
            '<td><a href="#">' + obj.data.endDate + '</a></td>' +
            '<td><a href="#">' + obj.data.phoneNumber + '</a></td>' +
            '<td><a href="#"><img src="' + hasImg(obj.data.hasPictures) + '"></a></td>' +
            '</tl>';
        }
        catch (error) {
          console.log(error);
        }
      }
      addRowHandlers();
    }).catch(function (error) {
      console.log('data error');
    });
}
function hasImg(val) {
  console.log('+hadsaf' + val);
  if (val > 0)
    return "/images/compact_camera.png";
  return "";
}

function addRowHandlers() {
  var table = document.getElementById("myTable");
  var rows = table.getElementsByTagName("tl");
  console.log(rows.length);
  for (i = 1; i < rows.length + 1; i++) {
    var currentRow = table.rows[i];
    var createClickHandler =
      function (row) {
        return function () {
          // var cell = row.getElementsByTagName("a")[0];
          // var id = cell.innerHTML;
          // var cell1 = row.getElementsByTagName("a")[1];
          // var id2 = cell1.innerHTML;
          var modal = document.getElementById("myModal");
          var modal2 = document.getElementById("modalUnits");
          var modal3 = document.getElementById("modalOrder");
          var span = document.getElementsByClassName("close")[0];
          var bd = row.getElementsByTagName("button")[0];
          span.onclick = function () {
            modal.style.display = "none";
          }
          window.onclick = function (event) {
            if (event.target == modal) {
              modal.style.display = "none";

            }
          }
          modal.style.display = "block";
          modal2.style.display = "block";
          modal3.style.display = "none";
          fillInformation(row.getElementsByTagName("a"),bd.value);
        };

      };

    currentRow.onclick = createClickHandler(currentRow);
  }
}
function fillInformation(id,uid) {
  document.getElementById("locationModal").value = id[0].innerHTML;
  document.getElementById("roomzModal").value = id[1].innerHTML;
  document.getElementById("priceModal").value = id[2].innerHTML;
  document.getElementById("ratingModal").value = id[3].innerHTML;
  document.getElementById("ownerNameModal").value = id[4].innerHTML;
  document.getElementById("startDateModal").value = id[5].innerHTML;
  document.getElementById("minDateModal").value = id[6].innerHTML;
  document.getElementById("endDateModal").value = id[7].innerHTML;
  document.getElementById("phoneNumberModal").value = id[8].innerHTML;
  document.getElementById("orderRef").href = "/order/" +uid;
}

function closeWindow() {
  var modal = document.getElementById("myModal");
  var modal2 = document.getElementById("modalUnits");
  var modal3 = document.getElementById("modalOrder");
  modal.style.display = "none";
  modal2.style.display = "none";
  modal3.style.display = "none";

}
function searchFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("tableBody");
  tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("a");
    tr[i].style.display = "none";
    for (var j = 0; j < td.length; j++) {
      if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        continue;
      }
    }
  }
}

function paymentWindow(x) {
  console.log("hasdf");
  /*
  var modal2 = document.getElementById("modalUnits");
  var modal3 = document.getElementById("modalOrder");
  modal2.style.display = "none";
  modal3.style.display = "block"; sToZ8DpQF1B8rwfdsKxz
  */
  fetch("/order/", {
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
    .then(function (resJ) {

    }).catch(function (error) {
      console.log('data error');
    });

}


var sortUpOrDown = 'desc';
function sortUp(columnName) {
  var x = document.getElementById("myInput").value;
  sortUpOrDown = 'desc';
  sendRequestToServer({ colName: columnName, sortDirection: sortUpOrDown, searchField: x, action: "sort" });
}

function sortDown(columnName) {
  var searchData = document.getElementById("myInput").value;
  sortUpOrDown = 'inc';
  sendRequestToServer({ colName: columnName, sortDirection: sortUpOrDown, searchField: searchData, action: "sort" });
}

function sendData() {
  var fromFilter, toFilter, searchData;
  searchData = document.getElementById("myInput").value;
  fromFilter = document.getElementById("fromFilter").value;
  toFilter = document.getElementById("toFilter").value;
  columnName = (document.getElementById("filter").selectedIndex == 0) ? "price" : "rooms";
  console.log(searchData + " " + fromFilter + " " + toFilter + " " + columnName);
  sendRequestToServer({ colName: columnName, searchField: searchData, lowerValue: fromFilter, higherValue: toFilter, action: "filter" });
}
