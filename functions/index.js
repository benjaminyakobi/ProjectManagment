/* eslint-disable promise/no-nesting */
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
    authDomain: "projectmanagement-612b8.firebaseapp.com",
    databaseURL: "https://projectmanagement-612b8.firebaseio.com/",
    storageBucket: "projectmanagement-612b8.appspot.com",
    projectId: "projectmanagement-612b8",
});
var bucket = admin.storage().bucket();
var cors = require('cors')({ origin: true });
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var ejs = require("ejs");
app.use(cookieParser());
/*const reqApp = express();
reqApp.use(cors);
reqApp.use(bodyParser.json());
reqApp.use(bodyParser.urlencoded({ extended: true }));*/
app.engine("html", ejs.renderFile);
app.set('view engine',ejs);
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

app.get("/renter.ejs", function (req, res) {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "renter")
            {            
                    var l = [];
                    var query = admin.firestore().collection('units').where('rid', '==', req.cookies.uid);
                    var allDocs = query.get().then(snapShot => {
                        if (snapShot.empty) {
                            console.log('No matching documents,firstPhase.');
                            return;
                        }
                        snapShot.forEach(doc => {
                            l.push({ id: doc.id, data: doc.data() });
                        });
                        res.render("renter.ejs",{l:l});
                    });          
            }
            else
                res.send("Not authorized!");
        })
        .catch((error) => {
            res.redirect("/");
        });
});

app.get("/Admin.ejs", function (req, res) {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "Admin")
            {

                var l = [];

                var query = admin.firestore().collection('requests');
                //var storageRef = firebaseApp.storage().ref();
                var allDocs = query.get().then(snapShot => {
                    snapShot.forEach(doc => {
                        l.push({ id: doc.id, data: doc.data() });
                    });
                    res.render("Admin.ejs",{l:l});
                });
            }
            else
                res.send("Not authorized!");
        })
        .catch((error) => {
            res.redirect("/");
        });
});

//web forwarding
app.get("/", function (req, res) {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "Admin") {
                req.url = '/Admin.ejs';
                app.handle(req, res);
            }
            else if (req.cookies.role === "student") {
                req.url = '/student.ejs';
                app.handle(req, res);
            }
            else if (req.cookies.role === "renter") {
                req.url = '/renter.ejs';
                app.handle(req, res);
            } else {
                res.render("index.html");
            }
        })
        .catch((error) => {
            res.render("index.html");
        });
});

//web forwarding :unitId
app.get("/order/:unitId", function (req, res) {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "student") {
                var query = admin.firestore().collection('units').doc(req.params.unitId);
                var allDocs = query.get().then(doc => {
                    if (!doc.exists) {
                        console.log('No matching documents,order request.');
                        res.send("bad unit id");
                        return;
                    }

                    res.render("order.ejs",{id:req.params.unitId,data:doc.data()});
                });
            } else {
                console.log('no auth');
                res.render("index.html");
            }
        })
        .catch((error) => {
            console.log(error);
            res.render("index.html");
        });
});


app.get("/renter/requests", function (req, res) {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "renter") {
                res.render("rentTrack.html");
            } else {
                res.render("index.html");
            }
        })
        .catch((error) => {
            res.render("index.html");
        });
});

//verify permissions and render site to requester
app.get("/student.ejs", function (req, res) {
    const sessionCookie = req.cookies.session || "";
    var role = req.cookies.role;
    //console.log(role);
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)//checkRevoked
        .then(() => {
            console.log(role);
            if (req.cookies.role === "student"){
            
                try {
                    var l = [];
                    var query = admin.firestore().collection('units');
                    var allDocs = query.get().then(snapShot => {
                        snapShot.forEach(doc => {
                            l.push({ id: doc.id, data: doc.data() });
                        });
                        res.render("student.ejs",{l:l});
                    });
                } catch (error) {
                    return res.status(500).send(error);
                }
              
            }
            else
                res.redirect("/");
        })
        .catch((error) => {
            console.log(error);
            res.redirect("/");
        });
});
app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/");
});


//Login and creating cookie 
app.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            // eslint-disable-next-line promise/always-return
            (sessionCookie) => {
                const userAuth = admin.firestore().collection('users').doc(req.body.uid);
                (async () => {
                    try {
                        var permA = "Unk";
                        userAuth.get().then(doc => {
                            var docF = doc.data();
                            var permDb = docF.perm || "no";
                            const options = { maxAge: expiresIn, httpOnly: true };
                            res.cookie("uid", req.body.uid);
                            res.cookie("role", permDb);
                            res.cookie("session", sessionCookie, options);
                            res.send(JSON.stringify({ status: "success" }));
                        }).catch(e => {
                            res.send("Unable to access database!");
                        });
                    }
                    catch (error) {
                        res.status(401).send("Unable to access database!");
                    }
                })();
            }).catch(e => {
                res.status(401).send("UNAUTHORIZED REQUEST!");

            });
});

//register account save records and give cookie
app.post("/registerAccount", (req, res) => {
    const idToken = req.body.idToken.toString();
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    admin.auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            // eslint-disable-next-line promise/always-return
            (sessionCookie) => {
                (async () => {
                    try {
                        if (req.body.lPerm === "student") {
                            var check = admin.firestore().collection('users').doc(req.body.uid).set({
                                email: req.body.email,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                perm: req.body.lPerm,
                                profileUrl: req.body.imgUrl
                            });

                            var checkRequest = admin.firestore().collection('requests').doc(req.body.uid).set({
                                email: req.body.email,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                perm: req.body.lPerm,
                                profileUrl: req.body.imgUrl
                            });
                        }
                        if (req.body.lPerm === "renter") {
                            var check2 = admin.firestore().collection('users').doc(req.body.uid).set({
                                email: req.body.email,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                bankAccount: req.body.bankAccount,
                                perm: req.body.lPerm
                            });
                        }
                        const options = { maxAge: expiresIn, httpOnly: true };
                        //var keys = [ req.body.uid.toString(),req.body.lPerm.toString() ]
                        res.cookie('role', req.body.lPerm);
                        res.cookie('uid', req.body.uid);
                        res.cookie("session", sessionCookie, options);
                        res.end(JSON.stringify({ status: "success" }));
                        //res.send('');
                    }
                    catch (error) {
                        res.send("Unable to access database!");
                    }
                })();
            }
        ).catch(e => {
            res.send("UNAUTHORIZED REQUEST!");

        });
});







/*
exports.newUserSignUp = functions.auth.user().onCreate(user => {
    return admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        firstName: 'fName',
        lastName: 'lName'
    });
});
*/
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


//Get a renter's units requests
app.post('/renterLease', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "renter") {
                var l = [];
                (async () => {
                    try {
                        var query = admin.firestore().collection('units');
                        //console.log(req.cookies.uid);
                        //var storageRef = firebaseApp.storage().ref();
                        var allDocs = query.where('rid', '==', req.cookies.uid).get().then(snapShot => {
                            snapShot.forEach(doc => {
                                if (snapShot.empty) {
                                    console.log('No matching documents,firstPhase.');
                                    return;
                                }
                                var query2 = admin.firestore().collection('requestPayment');
                                //var storageRef = firebaseApp.storage().ref();
                                //console.log(doc.id);
                                var allDocs2 = query2.where('unitid', '==', doc.id).get().then(snapShot2 => {
                                    if (snapShot2.empty) {
                                        console.log('No matching documents,SecondPhase..');
                                        return;
                                    }
                                    snapShot2.forEach(doc2 => {
                                        //        console.log('push');
                                        l.push({ id: doc2.id, data: doc2.data(), unitId: doc.id });
                                    });
                                    //    console.log(l);
                                    res.setHeader('Content-Type', 'application/json');
                                    return res.json({ status: 'OK', data: l });
                                });
                            });
                        });

                    } catch (error) {
                        console.log(error);
                        return res.status(500).send(error);
                    }
                })();

            }
            else
                res.send("Not authorized!");
        })
        .catch((error) => {
            res.send("Not authorized!");
        });
});
//get the admin account a list of users to veirfy from 
app.post('/requestAuth', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "Admin") {
                (async () => {
                    try {
                        var l = [];

                        var query = admin.firestore().collection('requests');
                        //var storageRef = firebaseApp.storage().ref();
                        var allDocs = query.get().then(snapShot => {
                            snapShot.forEach(doc => {
                                //var photoUrl ="";
                                //console.log(doc.id);
                                //console.log(toString(doc.id));
                                /*         var forestRef = storageRef.child('profileImages/'+doc.id +'/profile.png');
                                         var url = forestRef.getDownloadURL().then(function(url){
                                             photoUrl=url;
                                         });*/
                                l.push({ id: doc.id, data: doc.data() });
                            });

                            res.setHeader('Content-Type', 'application/json');
                            return res.json({ status: 'OK', data: l });
                        });
                    } catch (error) {
                        console.log(error);
                        return res.status(500).send(error);
                    }
                })();
            }
            else
                res.send("Not authorized!");
        })
        .catch((error) => {
            res.send("Not authorized!");
        });
});

//Admin command to verify or cancel a student account 
app.post('/adminRequest', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "Admin") {
                //  console.log(req.body.flag);
                if (req.body.flag == "true") {
                    var query = admin.firestore().collection('requests').doc(req.body.uid).delete();

                }
                else if (req.body.flag == "false") {
                    var query2 = admin.firestore().collection('requests').doc(req.body.uid).delete();
                    var query3 = admin.firestore().collection('users').doc(req.body.uid).delete();
                    admin.auth().deleteUser(req.body.uid)
                        .then(function (userRecord) {
                            console.log('Successfully deleted user');
                        })
                        .catch(function (error) {
                            console.log('Error deleting user:', error);
                        });
                }

                res.setHeader('Content-Type', 'application/json');
                return res.json({ status: 'OK', data: l });

            }
            else
                res.send("Not authorized!");
        })
        .catch((error) => {
            res.send("Not authorized!");
        });
});


app.post('/renterResponse', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "renter") {
                /////req.body.reqId
                // console.log(req.body.flag);
                if (req.body.flag == "true") {
                    var query = admin.firestore().collection('requestPayment').doc(req.body.uid);
                    //var storageRef = firebaseApp.storage().ref();
                    var allDocs = query.get().then(doc => {
                        var query4 = admin.firestore().collection('units').doc(req.body.uid).update({
                            sold:"true"
                        });
                        var query2 = admin.firestore().collection('Transactions').doc(doc.id).set(doc.data());
                        var query3 = admin.firestore().collection('requestPayment').where('unitid', '==', doc.data().unitid).get().then(snapShot => {
                            var batch = admin.firestore().batch();
                            snapShot.forEach(doc2 => {
                                batch.delete(doc2.ref);
                            });

                            batch.commit();
                        });
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ status: 'OK', data: l });
                    });
                }
                else if (req.body.flag == "false") {
                    var query = admin.firestore().collection('requestPayement').doc(req.body.uid).delete();
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ status: 'OK', data: l });
                }
            }
            else
                res.send("Not authorized!");
        })
        .catch((error) => {
            res.send("Not authorized!");
        });
});


//request all units 
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
                    l.push({ id: doc.id, data: doc.data() });
                });

                res.setHeader('Content-Type', 'application/json');
                return res.json({ status: 'OK', data: l });
            });
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});



//request all units Sort
app.post('/requestUSort', (req, res) => {
    const sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true )
        .then(() => {
            if(req.cookies.role == "student")
            {

                    (async () => {
                    try {
                        var query;
                        var l = [];
        
                        if(req.body.action == "sort")
                        {
                            if(req.body.sortDirection == "desc")
                            {
                                query = admin.firestore().collection('units').orderBy(req.body.colName,'desc');
                            }else{
                                query = admin.firestore().collection('units').orderBy(req.body.colName);
                            }
                        }
                        else if(req.body.action == "filter")
                        {
                            //query =  admin.firestore().collection('units').where(req.body.colName,'>=',req.body.lowerValue)
                            //.where(req.body.colName,'<=',req.body.higherValue);
                            query =  admin.firestore().collection('units').where(req.body.colName,'>=',Number(req.body.lowerValue))
                            .where(req.body.colName,'<=',Number(req.body.higherValue));
                        }
                        else
                            query = admin.firestore().collection('units');

                        var allDocs = query.get().then(snapShot => {
                            snapShot.forEach(doc => {
                                l.push({ id: doc.id, data: doc.data() });
                            });
                            res.setHeader('Content-Type', 'application/json');
                            return res.json({ status: 'OK', data: l });
                        });
                    } catch (error) {
                        return res.status(500).send(error);
                    }
                })();
            }
            else
                res.send("not authorized");
        })
        .catch((error) => {
            res.redirect("/");
        });
});


//request all units 
app.post('/requestOrder', (req, res) => {
    const sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true )
        .then(() => {
            if(req.cookies.role == "student")
            {
                var query = admin.firestore().collection('requestPayment').add({
                    email:req.body.email,
                    billTotal:Number(req.body.billTotal),
                    endDate:req.body.endDate,
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    phoneNumber:req.body.phoneNumber,
                    sId:req.cookies.uid,
                    startDate:req.body.startDate,
                    unitid:req.body.unitid,
                    ccFirstName:req.body.ccFirstName,
                    ccLastName:req.body.ccLastName,
                    ccNumber:req.body.ccNumber,
                    ccSec:req.body.ccSec,
                    ccExp:req.body.ccExp,
                    ccPostal:req.body.ccPostal
                });
                res.setHeader('Content-Type', 'application/json');
                return res.json({ status: 'OK'});
            }
            else
                res.send("not authorized");
        })
        .catch((error) => {
            res.redirect("/");
        });
});



//request all units of the request id
app.post('/requestRenter', (req, res) => {
    const sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => {
            if (req.cookies.role == "renter") {
                var l = [];
                var query = admin.firestore().collection('units').where('rid', '==', req.cookies.uid);
                var allDocs = query.get().then(snapShot => {
                    if (snapShot.empty) {
                        console.log('No matching documents,firstPhase.');
                        return;
                    }
                    snapShot.forEach(doc => {
                        l.push({ id: doc.id, data: doc.data() });
                    });

                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ status: 'OK', data: l });
                });
            } else {
                res.error("not Authorized!");
            }

        })

        .catch((error) => {

            res.error("server internal error");

        });
});

//post a unit from the renter to the firestore
app.post('/updateUnit', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => {
                (async () => {
                    try {

                        if (req.cookies.role == "renter") {
                            var check2 = admin.firestore().collection('units').doc(req.body.unitId).update({
                                location: req.body.location,
                                endDate: Date(req.body.endDate),
                                ownerName: req.body.ownerName,
                                phoneNumber: req.body.phoneNumber,
                                price: Number(req.body.price),
                                rating: req.body.rating,
                                rooms: Number(req.body.rooms),
                                startDate: Date(req.body.startDate)
                            }).then(()=>{
                                //var keys = [ req.body.uid.toString(),req.body.lPerm.toString() ]
                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ status: "success" }));
                            });
                        }
                        else {
                            res.send("not authorized post!");
                        }
                    }
                    catch (error) {
                        res.send("Unable to access database!");
                    }
                })();
        })
        .catch((error) => {
            return res.status(500).send('y are you');
        });

});

//post a unit from the renter to the firestore
app.post('/addUnit', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => {

                if (req.cookies.role == "renter") {
                    var check2 = admin.firestore().collection('units').add({
                        location: req.body.location,//1
                        endDate: req.body.endDate,//1
                        ownerName: req.body.ownerName,      //1
                        phoneNumber: req.body.phoneNumber,  //1
                        price: Number(req.body.price),      //1
                        rating: req.body.rating,            //1
                        rooms: Number(req.body.rooms),      //1
                        startDate: Date(req.body.startDate),       //1
                        hasPictures:req.body.hasPictures, //1
                        minDate: new Date(req.body.minDate).parse, //1
                        sold:"false",
                        rid:req.cookies.uid
                    }).then(()=>{
                        //var keys = [ req.body.uid.toString(),req.body.lPerm.toString() ]
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: "success" }));
                    });
                }
                else {
                    res.send("not authorized to post a unit!");
                }
                
        })
        .catch((error) => {
            return res.status(500).send('y are you');
        });

});


var PORT = 9000;
app.use('/js', express.static("js"));
app.use('/images', express.static("../images"));
app.use('/css', express.static("css"));
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
//export const reqApp = functions.https.onRequest((data, context) => {

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