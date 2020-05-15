class UserManagement {
    static login() {
        let username = document.getElementById("userName").value
        let password = document.getElementById("userPassword").value        
        alert("logging in")
        firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {
            // Handle Errors here.
                let error_code = error.code
                let error_message = error.message
                alert("Error:" + error_code + error_message)
                if (error_code === "auth/invalid-email") {
                    alert("Invalid Email")
                } else if (error_code == "auth/wrong-password") {
                    alert("Wrong password")
                }
            }) 
            alert(firebase.auth().currentUser)
            let user_type = "student" //TODO: attach properties to users..        
            alert("redirecting")
            if (user_type == "student"){            
                try{window.location.href = "/apihomepage_student.html"}
                catch(e) {window.location.href = "404.html"}   
                alert("why?") //dunno there needs to be another command for the redirect to happen weird..
            }
            else if (user_type == "renter") {
                try{window.location.href = "/apihomepage_renter.html"}
                catch(e) {window.location.href = "404.html"} 
            }
            else if (user_type == "admin") {
                try{window.location.href = "/apihomepage_admin.html"}
                catch(e) {window.location.href = "404.html"} 
            }
            else {
                alert("YOur user is from an unidentified type!")
            }  
            
    }

    static logout() {
        firebase.auth().signOut()
    }
    
    static forgotPassword() {
        
    }

    static signUp() {
        let username = document.getElementById("ue").value
        let password = document.getElementById("pass").value
        firebase.auth().createUserWithEmailAndPassword(username, password).catch(function(error) {
        // Handle Errors here.
            let error_code = error.code
            let error_message = error.message
            if (error_code == "Hello world")
                alert("problem")       
        })
    }

    static userType(val) {         
        let imgUpload = document.getElementById("imgup")        
        let bank = document.getElementById("bankAccount")        
        if (val == "student") {           
            imgUpload.style.display = "block"           
            bank.style.display = "none"            
        }
        if (val == "renter") {                       
            imgUpload.style.display = "none"         
            bank.style.display = "block"
        }
    }

    static empty(a) {
        return a
        //temporarly used to satisfy the linter will be deleted later
    }

}

UserManagement.empty(firebaseConfig)
UserManagement.empty(new UserManagement())