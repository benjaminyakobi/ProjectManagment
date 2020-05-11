
window.onload = function () {
    initApp();
};

function initApp() {
    var config = {
        apiKey: "AIzaSyDwIvIUQ02UrYTeJ_H96jW49NaQkXMTBVc",
        authDomain: "projectmanagement-612b8.firebaseapp.com",
        databaseURL: "https://projectmanagement-612b8.firebaseio.com/",
        projectId: "projectmanagement-612b8",

    };

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
        .then(function (resJ) {
            console.log(resJ.data);
            for (var i = 0; i < resJ.data.length; i++) {
                var obj = resJ.data[i];
                console.log(obj);
                console.log(obj.location);

                sss.innerHTML += '<tr>' + '<td>' + '<button class="btn btn-outline-success my-2 my-sm-0" type="submit" onclick=editInfoFunction();>Edit Info</button>' + '</td>' +
                    '<td>' + obj.location + '</td>' +
                    '<td>' + obj.rooms + '</td>' +
                    '<td>' + obj.price + '</td>' +
                    '<td>' + obj.ownerName + '</td>' +
                    '<td>' + obj.phoneNumber + '</td>' +
                    '<td><img src="' + hasImg(obj.hasPictures) + '"></td>' +
                    '</tr>';
            }

            /* have to implement this function to edit appartment information*/
            function editInfoFunction() {
                
            }
            window.editInfoFunction = editInfoFunction;

        }).catch(function (error) {
            console.log('data error');
        });


    const sss = document.getElementById("myTable");

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
                        shouldSwitch = true;
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
                switchcount++;
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


