window.onload = function() {
    initApp();
  };
function initApp()
{

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var forgotPasswordField = document.getElementById("forgotPass");

    var registerButton = document.getElementById("createUser");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];


    // When the user clicks the button, open the modal 
    forgotPasswordField.onclick = function() {
        modal.style.display = "block";
        removeUsername.style.display = "block";
        registerUser.style.display = "none";
        showQuestionWindow.style.display = "none";
        recoveryForm.reset();
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    const signOutButton = document.getElementById("signOutButton");

    const checkUsername = document.getElementById("checkUsernameBtn");

    const removeUsername = document.getElementById("modalOne");

    const showQuestionWindow = document.getElementById("modalTwo");

    const registerUser = document.getElementById("registerModal");

    const registerUserForm = document.querySelector(".registerForm");

    const recoveryForm = document.querySelector(".recoveryForm");

    const checkAnswer = document.getElementById("submitAnswerBtn");
    
    signOutButton.onclick = function() {
  
        firebase.auth().signOut().then(()=>{
            console.log("logged out");
        });
    }

    // When the user clicks the button, open the modal 
    registerButton.onclick = function() {
        modal.style.display = "block";
        registerUser.style.display = "block";
        showQuestionWindow.style.display = "none";
        removeUsername.style.display = "none";
    }

    function getUsername(){
        console.log("he")
        return document.getElementById("recoveryWindow").value;
    }


    checkAnswer.addEventListener('click',e =>{
        console.log(document.getElementById("userAnswer").value);
        if(document.getElementById("userAnswer").value=="a"){
            console.log("true");
        }
        else{
            console.log("invalid answer");
        }   
            
    });


    checkUsername.addEventListener('click',e =>{
        console.log(document.getElementById("recoveryWindow").value);

        if(document.getElementById("recoveryWindow").value=="t"){
            document.getElementById("getQuestion").innerHTML ='hello:'+ getUsername()+ ' your question is:';
            removeUsername.style.display = "none";
            showQuestionWindow.style.display = "block";
        }
        else
            console.log("invalid username");
          
            
    });

    registerUserForm.addEventListener('submit',e =>{
        e.preventDefault();
        console.log(registerUserForm.userE.value);  
        var userEmail = registerUserForm.userE.value;
        var userPass = registerUserForm.userP.value;
        firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
        .then( user =>{
            const addUserRecords =  firebase.functions().httpsCallable('addUserRecords');
            addUserRecords({
                stdId: registerUserForm.userStId.value
            }).then( () =>
            {
                registerUserForm.reset();
                console.log("registered");
            })
            .catch(function (error) {
                console.log('registery error')
            });
        });
    });


    function verifyAnswer(answer){
        return answer;
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
    // Get a reference to the database service

    const database = firebase.database();
    const auth = firebase.auth();
    const loginForm = document.getElementById('loginForm');
    const loginUser = document.getElementById('usernameField');
    const loginPass = document.getElementById('passwordField');

    const loginButton = document.getElementById("loginButton");
    const loginErrorMsg = document.getElementById("loginErrorMsg");


    loginButton.addEventListener('click',e =>{
        console.log("clicksss");
        var username = loginUser.value;
        var password = loginPass.value;

        var userId = firebase.auth().signInWithEmailAndPassword(username,password);
        userId.then(()=>{
            window.location.href="./renter.html";
        })
        .catch(e => {
            console.log(e.message);
            var errorCode = e.code;
            var errorMessage = e.message;
            loginErrorMsg.style.opacity = 1;
        }
        );
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
