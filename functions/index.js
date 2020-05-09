
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
    //  response.send("Hello from Firebase!");
    // });
    
    //var http = require('http');
    //var fs = require('fs');
    
    // The Firebase Admin SDK to access the Firebase Realtime Database.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebaseApp = admin.initializeApp(
    functions.config().admin
);

var express = require('express');
var app = express();

//var todoController = require('./controller/tdController')

//var app = express();
//console.log(__dirname);
//app.use(express.static(__dirname));
/*app.get('/',function (req, res) {
    res.sendFile('./index.html');
});*/

//new user signup

exports.newUserSignUp = functions.auth.user().onCreate(user =>{
    return admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        studentId: 0
    });
});

exports.addUserRecords = functions.https.onCall((data,context)=>{
    const userR = admin.firestore().collection('users').doc(context.auth.uid);
    return userR.update({
        studentId: data.stdId
    });
    /*return userR.get().then(doc=>{
    });*/
        
  /*  return userR.get().then( doc =>{
        
    });*/
});

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

exports.requestUnits = functions.https.onCall((data,context)=>{
    
    var query =  admin.firestore().collection('units');
    return query.get().then(snapshot => {
        //console.log(snapshot.docs);
        var resp = [];
        snapshot.docs.forEach(doc =>{
            resp += doc;
        })
        console.log(resp);
        return snapshot.docs;
    });
});
app.get('/rU', (req,res)=>{
       //res.send("wow");
       (async() => {
            try{
                var l= [];
                var query =  admin.firestore().collection('units');
                var allDocs = query.get().then(snapShot=>{
                snapShot.forEach(doc=>{
                    l.push(doc.data());
                });
                
                
                return res.status(200).send(l);
                });
            }catch(error)
            {
                return res.status(500).send(error);
            }
    })();
});
app.use(express.static('./src'));

   /* query.get().then(doc =>{
        if (doc.exists) {
            return res.status(200).json(doc.data());
        } else {
            return res.status(400).json({"message":"User ID not found."});
        }
    }).catch(e=>{
        return res.status(400).json({"message":"Unable to connect to Firestore."});
    });*/

exports.api = functions.https.onRequest(app);


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