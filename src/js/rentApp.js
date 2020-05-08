window.onload = function() {
    initApp();
  };
function initApp()
{


   /* const signOutButton = document.getElementById("signOutButton");

    signOutButton.onclick = function() {
  
        firebase.auth().signOut().then(()=>{
            console.log("logged out");
        });
    }
*/


    var config = {
        apiKey: "AIzaSyDwIvIUQ02UrYTeJ_H96jW49NaQkXMTBVc",
        authDomain: "projectmanagement-612b8.firebaseapp.com",
        databaseURL: "https://projectmanagement-612b8.firebaseio.com/",
        projectId: "projectmanagement-612b8",

    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            user.getIdTokenResult().then(idTokenResult => {
                user.renter = idTokenResult.claims.admin;
                if ( user.renter != true)
                {
                    console.log("unauthorized access!");
                    //window.location.href=".html";
                }
            })
            // User is signed in.
            console.log('logged');
        } else {
            // No user is signed in.
            console.log('no logged');
        }
    });
    // Get a reference to the database service

    const database = firebase.database();
    const auth = firebase.auth();
   
}

/*
function lClick()
{
    //e.preventDefault();
    console.log("clicksss");
   /* const username = loginUser.value;
    const password = loginPass.value;

    // var userId = firebase.auth().signInWithUserAndPassword(username,password);
    // userId.catch(e=> alert(e.message));
    firebase.auth().createUserWithEmailAndPassword(username, password).catch(function (error) {
        // Handle Errors here.
        /*var errorCode = error.code;
        var errorMessage = error.message;
        loginErrorMsg.style.opacity = 1;*/
        // ...
    //});*/

//}

    /* return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // ...
});*/

/*  if (username === "user" && password === "web_dev") {
    alert("You have successfully logged in.");
    location.reload();
} else {
    loginErrorMsg.style.opacity = 1;
}
});*/
