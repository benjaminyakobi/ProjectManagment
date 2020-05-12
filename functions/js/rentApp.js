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

    const modalVarThree = document.getElementById("modalThree");
    modalVarThree.style.display = "none";

    var cancelSpan = document.getElementById("closeTwo");
    cancelSpan.onclick = function () {
        const modalVar = document.getElementById("myModal");
        modalVar.style.display = "none";
    }

    var cancelSpan = document.getElementById("cancelTwo");
    cancelSpan.onclick = function () {
        const modalVar = document.getElementById("myModal");
        modalVar.style.display = "none";
    }

    var cancelSpan = document.getElementById("saveTwo");
    cancelSpan.onclick = function () {
        const modalVar = document.getElementById("myModal");
        const form = document.getElementById("editInfoFormTwo");
        console.log("running");
          //request to db to update data
            fetch("/updateUnit", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify({ 
                                        endDate:    form.untilDate.value,
                                        location:   form.location.value,
                                        ownerName:  form.owner.value,
                                        phoneNumber:form.phone.value, 
                                        price:      form.price.value,
                                        rating:     form.rating.value,
                                        rooms:      form.rooms.value,
                                        startDate:   form.fromDate.value,
                                        unitId:     form.uid.value
                                    }),
            })
            
                .then(response => response.json())
                .then(function (resJ) {
                    console.log(resJ.data);

                }).catch(function (error) {
                    console.log('data error');
                });

          //  const sss = document.getElementById("myTable");
            
        //modalVar.style.display = "none";
    };


fetch("/requestRenter", {
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
        .then(function(resJ) {
            console.log(resJ.data);
            // eslint-disable-next-line promise/always-return
            for (var i = 0; i < resJ.data.length; i++) {
                var obj = resJ.data[i];
                //console.log(obj.id);
                sss.innerHTML += '<tl>' +
                        '<td><a href="#">' + obj.data.location + '</a></td>' +
                        '<td><a href="#">' + obj.data.rooms + '</a></td>' +
                        '<td><a href="#">' + obj.data.price + '</a></td>' +
                        '<td><a href="#">' + obj.data.rating + '</a></td>' +
                        '<td><a href="#">' + obj.data.ownerName + '</a></td>' +
                        '<td><a href="#">' + obj.data.startDate + '</a></td>' +
                        '<td><a href="#">' + obj.data.endDate + '</a></td>' +
                        '<td><a href="#">' + obj.data.phoneNumber + '</a></td>' +
                        '<td><a href="#"><img src="' + hasImg(obj.data.hasPictures) + '"></a></td>' +
                        '<td style="display:none;"><button value='+obj.id+' ></button></td>' +
                    '</tl>';
                //note: obj.id is a unique unit-id
            }
            addRowHandlers();

        }).catch(function (error) {
            console.log('data error');
        });

    const sss = document.getElementById("myTable");
    
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
                    var cell = row.getElementsByTagName("a")[0];
                    var id = cell.innerHTML;
                    var cell1 = row.getElementsByTagName("a")[1];
                    var id2 = cell1.innerHTML;
                    var bd = row.getElementsByTagName("button")[0];
                    var modal = document.getElementById("myModal");
                    var modal1 = document.getElementById("modalOne");
                    var modal2 = document.getElementById("modalTwo");
                    var modal3 = document.getElementById("modalThree");
                    var span = document.getElementsByClassName("close")[0];
                    span.onclick = function () {
                        modal.style.display = "none";
                    }
                    window.onclick = function (event) {
                        if (event.target == modal) {
                            modal.style.display = "none";

                        }
                    }
                    modal.style.display = "block";
                    modal1.style.display = "none";
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
    document.getElementById("endDateModal").value = id[6].innerHTML;
    document.getElementById("phoneNumberModal").value = id[7].innerHTML;
    document.getElementById("savChangesB").value = uid;
    console.log(uid);
}


function searchFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
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

var sortUpOrDown = 'dec';
function sortUp(columnName) {
    console.log("up");
    sortUpOrDown = 'dec';
    return { columnName: sortUpOrDown };
}

function sortDown(columnName) {
    console.log("down");
    sortUpOrDown = 'inc';
    return { columnName: sortUpOrDown };
}