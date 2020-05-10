/* eslint-disable promise/always-return */
/* eslint-disable prefer-arrow-callback */

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//var http = require('http');
//var fs = require('fs');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const csrf = require("csurf");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cookieParser = require("cookie-parser");
const serviceAccount = require("../serviceAccountKey.json");
const csrfMiddleware = csrf({ cookie: true });
const firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        apiKey: "AIzaSyDwIvIUQ02UrYTeJ_H96jW49NaQkXMTBVc",
        authDomain: "projectmanagement-612b8.firebaseapp.com",
        databaseURL: "https://projectmanagement-612b8.firebaseio.com/",
        storageBucket: "projectmanagement-612b8.appspot.com",
        projectId: "projectmanagement-612b8",
});

var cors = require('cors')({ origin: true });
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
app.use(cookieParser());
/*const reqApp = express();
reqApp.use(cors);
reqApp.use(bodyParser.json());
reqApp.use(bodyParser.urlencoded({ extended: true }));*/
app.engine("html", require("ejs").renderFile);
app.use(cors);
app.use(csrfMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//var todoController = require('./controller/tdController')

//var app = express();
//console.log(__dirname);
//app.use(express.static(__dirname));
/*app.get('/',function (req, res) {
    res.sendFile('./index.html');
});*/

//new user signup

app.get("/", function (req, res) {
    res.render("index.html");
});
app.get("/student.html", function (req, res) {
    const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
      res.render("student.html");
    })
    .catch((error) => {
      res.redirect("/");
    });
   // res.render("student.html");
});
app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/");
});



app.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();
  
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
  
    admin
      .auth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        // eslint-disable-next-line promise/always-return
        (sessionCookie) => {

          const options = { maxAge: expiresIn, httpOnly: true };
          res.cookie("session", sessionCookie, options);
          res.end(JSON.stringify({ status: "success" }));
          
        }).catch(e => {
            res.status(401).send("UNAUTHORIZED REQUEST!");

        });
     } );
  

app.post("/registerAccount", (req, res) => {
    const idToken = req.body.idToken.toString();
    console.log('server');
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    admin.auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            // eslint-disable-next-line promise/always-return
            (sessionCookie) => {
                var check = admin.firestore().collection('users').doc(req.body.uid).set({
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                });
                var checkRequest = admin.firestore().collection('requests').doc(req.body.uid).set({
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                });
                const options = { maxAge: expiresIn, httpOnly: true };
                
                res.cookie("session", sessionCookie, options);
                res.end(JSON.stringify({ status: "success" }));
            }
        ).catch(e => {
            res.status(401).send("UNAUTHORIZED REQUEST!");

        });
});



exports.newUserSignUp = functions.auth.user().onCreate(user => {
    return admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        firstName: 'fName',
        lastName: 'lName'
    });
});

exports.addUserRecords = functions.https.onCall((data, context) => {
    const userR = admin.firestore().collection('users').doc(context.auth.uid);
    const requestR = admin.firestore().collection('requests').doc(context.auth.uid);
    return userR.update({
        firstName: data.firstName,
        lastName: data.lastName
    }).then(() => {
        return requestR.set({
            uid: context.auth.uid,
            firstName: 'fName',
            lastName: 'lName'
        });
    });
});

app.post('/rU', (req, res) => {
  /*  const sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked )
        .then(() => {
        res.render("student.html");
    })
    .catch((error) => {
    res.redirect("/");
    });*/
    //res.send("wow");
    (async () => {
        try {
            var l = [];
            var query = admin.firestore().collection('units');
            var allDocs = query.get().then(snapShot => {
                snapShot.forEach(doc => {
                    l.push(doc.data());
                });


                return res.status(200).json({ status: 'OK', data: l });
            });
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

app.post('/getRequests', (req, res) => {
    try {
        if (req.user.authenticated) {
            return res.render('es/login', { title: 'Hello - Please Login To Your Account' });
        }
    }
    catch (error) {
        return res.status(500).send('y are you');
    }

    (async () => {
        try {
            /*    var l = [];
                var query = admin.firestore().collection('units');
                var allDocs = query.get().then(snapShot => {
                    snapShot.forEach(doc => {
                        l.push(doc.data());
                        
                        
                    });
                });*/
            return res.status(200).json({ status: 'OK', data: "kk" });
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});
var PORT = 9000;
app.use('/js', express.static("js"));
app.use('/images', express.static("../images"));
app.use('/css', express.static("css"));
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
//export const reqApp = functions.https.onRequest((data, context) => {

//});
/*
exports.requestUnits = functions.https.onRequest((data, context) => {

    return app.get('/rU', (req, res) => {
        //res.send("wow");
        (async () => {
            try {
                var l = [];
                var query = admin.firestore().collection('units');
                var allDocs = query.get().then(snapShot => {
                    snapShot.forEach(doc => {
                        l.push(doc.data());
                    });


                    return res.status(200).json({ status: 'OK', data: l });
                });
            } catch (error) {
                return res.status(500).send(error);
            }
        })();
    });
});*/
/*  var query = admin.firestore().collection('units');
  return query.get().then(snapshot => {
      //console.log(snapshot.docs);
      var resp = [];
      snapshot.docs.forEach(doc => {
          resp += doc;
      })
      console.log(resp);
      return snapshot.docs;
  });*/

/*
export const requiresAuth = async (req, res, next) => {
    const idToken = req.header('FIREBASE_AUTH_TOKEN');

    // https://firebase.google.com/docs/reference/admin/node/admin.auth.DecodedIdToken
    let decodedIdToken;

    try {
        decodedIdToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
        next(error);
        return;
    }

    req.user = decodedIdToken;
    next();
}*/
/*
app.get('/example', async (req, res) => {
    const idToken = req.header('FIREBASE_AUTH_TOKEN');
    console.log(idToken);
    let decodedIdToken;
    try {
        decodedIdToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
        console.log(error);
        return;
    }
    req.user = decodedIdToken;
    console.log(req.user)
})
*/
//exports.api = functions.https.onRequest(app);
/*
exports.getRequests = functions.https.onCall((data, context) => {

    if (!context.auth)
        throw new functions.https.HttpsError(
            'unauthenticated'
        );
    (async () => {
        try {
            var l = [];
            var query = admin.firestore().collection('requests');
            var allDocs = query.get().then(snapShot => {
                snapShot.forEach(doc => {
                    l.push(doc.data());
                });

                var dataJson = { status: 'OK', data: l };
                return context.status(200).send(JSON.stringify(dataJson));
            });
        } catch (error) {
            return context.status(500).send(error);
        }
    })();
});*/
/*
async function verifyToken(req,res,next){

        // Verify the ID token first.
    admin.auth().verifyIdToken(idToken).then((claims) => {
    if (claims.admin === true) {
        // Allow access to requested admin resource.
    }
    });*/
/* const idToken = req.headers.authorization;
 try{
     const decodedToken = await admin.auth().verifyIdToken(idToken);
     if(decodedToken){
         req.body.uid = decodedToken.uid;
         return next();
     }else{
         return res.status(401).send('not Authorized');
     }
 }catch(e){
     return res.status(401).send('not Authorized');
 }
 const token = req.header('Authorization').replace('Bearer', '').trim();
 var user = firebase.auth().currentUser;
 if (user) {
     admin.auth().verifyIdToken(token)
         .then( (decodedToken)=> {
             if(decodedToken.uid === user.uid)
             {
                 req.user = user.uid;
                 return next();
             }
             else{
                 return res.status(401).send('not Authorized');
             }
     }).catch((error)=> {
         return res.status(401).send('not Authorized');
     });
 } else {
     return res.status(401).send('not Authorized');
 }
}
const authenticate = async (req, res, next) => {
 if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
   res.status(403).send('Unauthorized');
   return;
 }
 const idToken = req.headers.authorization.split('Bearer ')[1];
 try {
   const decodedIdToken = await admin.auth().verifyIdToken(idToken);
   req.user = decodedIdToken;
   next();
   return;
 } catch(e) {
   res.status(403).send('Unauthorized');
   return;
 }
};
const authenticate = async (req, res, next) => {
    //req.user &&
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/index.html');
    }
};

const authen = function checkAuth(req, res, next) {
    if (req.headers.authtoken) {
        admin.auth().verifyIdToken(req.headers.authtoken)
            .then(() => {
                return next();
            }).catch(() => {
                return res.status(403).send('Unauthorized');
            });
    } else {
        res.status(403).send('Unauthorized');
    }
}*/
/*
var kk = 3000;
var server = http.createServer(function (req, res) {
    if (req.url == '/index.html' || req.url == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        var myReadStream = fs.createReadStream(__dirname + '/index.html', 'utf8');
        myReadStream.pipe(res);
    }

}
)
server.listen(kk, '127.0.0.1');
console.log('sssddd');*/

//app.use(express.static('./src'));

/* query.get().then(doc =>{
     if (doc.exists) {
         return res.status(200).json(doc.data());
     } else {
         return res.status(400).json({"message":"User ID not found."});
     }
 }).catch(e=>{
     return res.status(400).json({"message":"Unable to connect to Firestore."});
 });*/


/*
exports.userDeleted = functions.auth.user().onDelete(user =>{
    const id = admin.firestore().collection('users').doc(user.uid);
    return id.delete();
});
exports.addRequest = functions.https.onCall((data,context)=>{
    if(!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'by passed login'
        );
    }
    return admin.firestore().collection('units').add({

    });
});
*/