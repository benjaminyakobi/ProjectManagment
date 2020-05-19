window.onload = function () {
    initApp();
};

function initApp() {
    var config = {
        apiKey: "AIzaSyDwIvIUQ02UrYTeJ_H96jW49NaQkXMTBVc",
        storageBucket: "projectmanagement-612b8.appspot.com",
        projectId: "projectmanagement-612b8",
    };
    firebase.initializeApp(config);

    function hasImg(val) {
        if (val)
            return "https://firebasestorage.googleapis.com/v0/b/projectmanagement-612b8.appspot.com/o/icons%2Fcompact_camera.png?alt=media&token=e23f870d-4f38-4e92-a4fb-d3eddffd65da";
        return "";
    }

    const modalVarThree = document.getElementById("modalThree");
    modalVarThree.style.display = "none";

    var cancelSpan = document.getElementById("closeTwo");
    cancelSpan.onclick = function () {
        const modalVar = document.getElementById("myModal");
        modalVar.style.display = "none";
    }

    var cancelSpan2 = document.getElementById("cancelTwo");
    cancelSpan2.onclick = function () {
        const modalVar = document.getElementById("myModal");
        modalVar.style.display = "none";
    }

    var cancelSpan3 = document.getElementById("saveTwo");
    cancelSpan3.onclick = function () {
        //*check dates.
        const startDateModalThree = document.getElementById("startDateModal");
        const endDateModalThree = document.getElementById("endDateModal");
        const minDateModalThree = document.getElementById("minDateModal");
        var date1 = new Date(startDateModalThree.value);
        var date2 = new Date(endDateModalThree.value);
        var date3 = new Date(minDateModalThree.value);
        var diff = (date2 - date3) / 1000;
        var diff2 = (date3 - date1) / 1000;
        var diff3 = (date2 - date1) / 1000;
        var days = Math.floor(diff / 86400);
        var days3 = Math.floor(diff2 / 86400);
        var days2 = Math.floor(diff2 / 86400);
        if(days<0 ||days3<0||days2<0)
        {
            alert("Please enter a valid Until Date");
            return;
        }


        //*check if anything missing
        const loc= document.getElementById("locationModal");
        const loc2= document.getElementById("roomzModal");
        const loc3= document.getElementById("priceModal");
        const loc4= document.getElementById("ratingModal");
        const loc5= document.getElementById("ownerNameModal");
        const loc6= document.getElementById("startDateModal");
        const loc7= document.getElementById("endDateModal");
        const loc8= document.getElementById("minDateModal");
        const loc9= document.getElementById("phoneNumberModal");
        const loc0= document.getElementById("descriptionModal");
        if(loc.value==""||loc2.value==""||loc3.value==""||loc4.value==""||loc5.value==""||
        loc6.value==""||loc7.value==""||loc8.value==""||loc9.value==""||loc0.value=="")
        {
            alert("Missing information");
            return;
        }


        const modalVar = document.getElementById("myModal");
        const form = document.getElementById("editInfoFormTwo");
        // console.log("running");
         
  /*      var fDate = new Date(form.fromDate.value);
        var uDate = new Date(form.untilDate.value);

        if(fDate.getTime() - uDate.getTime() > 0){
            alert('Invalid Dates, From-Date is Greater than Until-Date, try again!');
            return;
        }*/

        //request to db to update data
        fetch("/api/updateUnit", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify({
                endDate: form.untilDate.value,
                location: form.location.value,
                ownerName: form.owner.value,
                phoneNumber: form.phone.value,
                minDate: form.minimumDate.value,
                price: form.price.value,
                rating: form.rating.value,
                rooms: form.rooms.value,
                startDate: form.fromDate.value,
                description: form.description.value,
                unitId: form.uid.value
            }),
        })

            .then(response => response.json())
            // eslint-disable-next-line promise/always-return
            .then(function (resJ) {
                console.log(resJ.data);

            }).catch(function (error) {
                console.log('data error');
            });

        modalVar.style.display = "none";
        location.reload();
    };

        addRowHandlers();

        const sss = document.getElementById("tableBody");
        
        function addRowHandlers() {
            var table = document.getElementById("tableBody");
            var rows = table.getElementsByTagName("tr");
            console.log(rows.length);
            for (i = 0; i < rows.length; i++) {
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

                            fillInformation(row.getElementsByTagName("a"), bd.value);
                        };

                    };

                currentRow.onclick = createClickHandler(currentRow);
            }
        }
                
        function fillInformation(id, uid) {
            document.getElementById("locationModal").value = id[0].innerHTML;
            document.getElementById("roomzModal").value = id[1].innerHTML;
            document.getElementById("priceModal").value = id[2].innerHTML;
            document.getElementById("ratingModal").value = id[3].innerHTML;
            document.getElementById("ownerNameModal").value = id[4].innerHTML;
            document.getElementById("startDateModal").value = id[5].innerHTML;
            document.getElementById("endDateModal").value = id[7].innerHTML;
            document.getElementById("minDateModal").value = id[6].innerHTML;
            document.getElementById("phoneNumberModal").value = id[8].innerHTML;
            document.getElementById("savChangesB").value = uid;
            document.getElementById("descriptionModal").value = id[10].innerHTML;
        }

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

                    fillInformation(row.getElementsByTagName("a"), bd.value);
                };

            };

        currentRow.onclick = createClickHandler(currentRow);
    }
}

function fillInformation(id, uid) {
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