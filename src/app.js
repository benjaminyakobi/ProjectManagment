window.onload = function() {
    initApp();
  };
function initApp()
{

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var forgotPasswordField = document.getElementById("forgot-pass");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    forgotPasswordField.onclick = function() {
    modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    document.getElementById("getQuestion").innerHTML = getQuestionByUsername();
    function getQuestionByUsername(){
    return 'your question';
    }

    function verifyAnswer(){
    return 'correct';
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
    modal.style.display = "none";
    }
    }


    // Set the configuration for your app
    // TODO: Replace with your project's config object
    
    var config = {
        apiKey: "AIzaSyDwIvIUQ02UrYTeJ_H96jW49NaQkXMTBVc",
        authDomain: "projectmanagement-612b8.firebaseapp.com",
        databaseURL: "https://projectmanagement-612b8.firebaseio.com/"
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
    // Get a reference to the database service

    const database = firebase.database();
    const auth = firebase.auth();
    const loginForm = document.getElementById('login-form');
    const loginUser = document.getElementById('username-field');
    const loginPass = document.getElementById('password-field');

    const loginButton = document.getElementById("loginButton");
    const loginErrorMsg = document.getElementById("login-error-msg");


    loginButton.addEventListener('click',e =>{
        console.log("clicksss");
        var username = loginUser.value;
        var password = loginPass.value;

        var userId = firebase.auth().signInWithEmailAndPassword(username,password);
        userId.catch(e => {
            console.log(e.message);
            var errorCode = e.code;
            var errorMessage = e.message;
            loginErrorMsg.style.opacity = 1;
 
    });
    });
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
