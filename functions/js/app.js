/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
window.onload = function() {
    initApp();
  };
function initApp()
{

    //contain profile image
    let file={};

    // Get the modal
    const modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var forgotPasswordField = document.getElementById("forgotPass");

    var registerButton = document.getElementById("createUser");

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];


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

    const signOutButton = document.getElementById("logoutButton");

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
    
    //render image
    document.getElementById("img").onchange = function setImage(evt) {
        console.log('change');
        var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
        file = evt.target.files[0];
        // FileReader support
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function () {
                document.getElementById("prevImage").src = fr.result;
            }
            fr.readAsDataURL(files[0]);
        }
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

        var fName = registerUserForm.firstName.value;
        var lName = registerUserForm.lastName.value;
        var bankN = registerUserForm.bank.value;
        console.log(fName);
        console.log(lName);
        console.log(val);
        console.log(bankN);
        var saveUrl="";
        var sentPack={};
        var saveA = null;
            // eslint-disable-next-line promise/catch-or-return
            // eslint-disable-next-line promise/always-return

                firebase
                .auth()
                .createUserWithEmailAndPassword(userEmail, userPass)
                .then((Authh) => {
                    saveA =Authh;
                    return Authh.user.getIdToken().then((idToken) => {
                        console.log(val);
                        if(val == "student")
                        {   
                            (async () => {
                                    try {  
                                var resp = await storage.ref('profileImages/' +saveA.user.uid +'/profile.png').put(file).then((snapshot)=>{
                                    // eslint-disable-next-line prefer-arrow-callback
                                    snapshot.ref.getDownloadURL().then(function(url){
                                        console.log(saveUrl);
                                        sentPack =JSON.stringify({ idToken ,uid:Authh.user.uid,email:userEmail,firstName:fName,lastName:lName,lPerm:val,imgUrl:url});
                                        return fetch("/registerAccount", 
                                        {
                                            method: "POST",
                                            headers: {
                                                Accept: "application/json",
                                                "Content-Type": "application/json",
                                                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                                            },
                                            body: sentPack,
                                        });
                                    }).catch( e =>{
                                        console.log("upload failed");
                                    });          
                                })
                                
                                }catch(error){
                                    console.log('fail upload');
                                }
                            })()
                        }
                        else if (val == "renter"){
                            sentPack =JSON.stringify({ idToken ,uid:Authh.user.uid,email:userEmail,firstName:fName,lastName:lName,lPerm:val,bankAccount:bankN});
                            return fetch("/registerAccount", 
                            {
                                method: "POST",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                    "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                                },
                                body: sentPack,
                            });
                        }
                        
                    });
                })
                .then(() => {
                    if(val == "student"){
                        // eslint-disable-next-line promise/always-return
                        console.log("registered");
                    }
                    else if(val == "renter")
                    {
                        console.log("registered renter");
                        registerUserForm.reset();
                    }
                });
            return false;
            
            }
        );
 
   var val = "student";
   const radioR = document.getElementById("renter");
   const radioS = document.getElementById("student");
   radioR.onclick = function userType() {       
        val = "renter";
        let imgUpload = document.getElementById("imgup");        
        let bank = document.getElementById("bankAccount") ;       
        if (val == "student") {           
            imgUpload.style.display = "block"  ;         
            bank.style.display = "none" ;           
        }
        if (val == "renter") {                       
            imgUpload.style.display = "none" ;        
            bank.style.display = "block";
        }
    };     
    radioS.onclick = function userType() {    
        val = "student";   
        let imgUpload = document.getElementById("imgup");        
        let bank = document.getElementById("bankAccount") ;       
        if (val == "student") {           
            imgUpload.style.display = "block"  ;         
            bank.style.display = "none" ;           
        }
        if (val == "renter") {                       
            imgUpload.style.display = "none" ;        
            bank.style.display = "block";
        }
    }; 
    const f1 = function userType(val) {       
        let imgUpload = document.getElementById("imgup");        
        let bank = document.getElementById("bankAccount") ;       
        if (val == "student") {           
            imgUpload.style.display = "block"  ;         
            bank.style.display = "none" ;           
        }
        if (val == "renter") {                       
            imgUpload.style.display = "none" ;        
            bank.style.display = "block";
        }
    }    

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
        storageBucket: "projectmanagement-612b8.appspot.com",
        projectId: "projectmanagement-612b8"

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
    const storage = firebase.storage();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    const loginForm = document.getElementById('loginForm');
    const loginUser = document.getElementById('usernameField');
    const loginPass = document.getElementById('passwordField');
    const loginButton = document.getElementById("loginButton");
    const loginErrorMsg = document.getElementById("loginErrorMsg");


    loginButton.addEventListener('click',e =>{
        console.log(username+password);
        var username = loginUser.value;
        var password = loginPass.value;
        
        firebase
        .auth()
        .signInWithEmailAndPassword(username, password)
        .then(( Authh ) => {
           saveA =Authh;
          return Authh.user.getIdToken().then((idToken) => {
              console.log(Authh.user.uid);
            return fetch("/sessionLogin", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
              },
              body: JSON.stringify({ idToken ,uid:Authh.user.uid}),
            });
          });
        })
        .then(() => {

            window.location.href="/";
            console.log('cookie connection');
        //  window.location.assign("/student.html");
        });
    });
}


            //   console.log(user.uid);
                  //  var accessToken = null;
/*
                    firebase.auth().currentUser
                        .getIdToken()
                        .then(function (token) {
                            console.log(token);
                            accessToken = token;
        
                            const gR =  firebase.functions().httpsCallable('api/getRequests');
                            gR.headers['FIREBASE_AUTH_TOKEN'] = accessToken;
                            gR().then( res =>
                            {
                                //console.log(res.data);
                                //console.log(res.data[0]);
                                console.log("got data");
                            })
                            .catch(function (error) {
                                console.log('data error');
                            });     */
        
        
                     //   });
                 /*   const gR =  firebase.functions().httpsCallable('api/getRequests');
                    gR().then( res =>
                    {
                        //console.log(res.data);
                        //console.log(res.data[0]);
                        console.log("got data");
                    })
                    .catch(function (error) {
                        console.log('data error');
                    });*/
/*
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
        );*/
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
