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
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const serviceAccount = require("./serviceAccountKey.json");
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
app.set('view engine', ejs);
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

app.get("/renter", function (req, res) {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "renter" || req.cookies.role === "Admin") {
                var l = [];
                var query = admin.firestore().collection('units').where('rid', '==', req.cookies.uid).where('sold','==','false');
                var allDocs = query.get().then(snapShot => {
                    /*              if (snapShot.empty) {
                                      console.log('No matching documents,firstPhase.');
                                      res.render("renter.ejs",{l:l});
                                      return;
                                  }*/
                    snapShot.forEach(doc => {
                        l.push({ id: doc.id, data: doc.data() });
                    });
                    //console.log(l);
                    var adminLog ;
                    if (req.cookies.role === "Admin")
                        adminLog = "true";
                    else
                        adminLog = "false";

                    res.render("renter.ejs", { l: l ,isAdmin:adminLog});
                });
            }
            else
                res.send("Not authorized!");
        })
        .catch((error) => {
            res.redirect("/api/");
        });
});

app.get("/Admin.ejs", function (req, res) {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "Admin") {

                var l = [];

                var query = admin.firestore().collection('requests');
                //var storageRef = firebaseApp.storage().ref();
                var allDocs = query.get().then(snapShot => {
                    snapShot.forEach(doc => {
                        l.push({ id: doc.id, data: doc.data() });
                    });
                    res.render("admin.ejs", { l: l });
                });
            }
            else
                res.send("Not authorized!");
        })
        .catch((error) => {
            res.redirect("/api/");
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
                req.url = '/renter';
                app.handle(req, res);
            } else if (req.cookies.role == "Verify") {
                res.clearCookie("session");
                res.send("Wait for admin verification");
            }
            else {
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

                    res.render("order.ejs", { id: req.params.unitId, data: doc.data() });
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

app.get("/renter/history/:typeIn/:fromFilter/:toFilter", function (req, res) {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "renter" || req.cookies.role === "Admin") {
                (async () => {
                    let users;
                    if (req.params.typeIn == "rooms") {
                     //   console.log(req.params.fromFilter);
                     //   console.log(req.params.toFilter);
    
                        users = await admin.firestore().collection('units').where('rid', '==', req.cookies.uid).where("rooms", '>=', Number(req.params.fromFilter))
                            .where("rooms", '<=', Number(req.params.toFilter)).get();
                    } else if (req.params.typeIn == "price") {
                     //   console.log(req.params.fromFilter);
                     //   console.log(req.params.toFilter);
    
                        users = await admin.firestore().collection('units').where('rid', '==', req.cookies.uid).where("price", '>=', Number(req.params.fromFilter))
                            .where("price", '<=', Number(req.params.toFilter)).get();
                    }else if (req.params.typeIn == "priceT") {
                        //   console.log(req.params.fromFilter);
                        //   console.log(req.params.toFilter);
       
                           users = await admin.firestore().collection('units').where('rid', '==', req.cookies.uid).get();
                    }
                    else if (req.params.typeIn == "0") {
                        users = await admin.firestore().collection('units').where('rid', '==', req.cookies.uid).get();
                    }

                    let sum=0;
                    let l=[];
                    let userPromises = [];
                    users.forEach((userDoc) => {
                        //let userDocData = userDoc.data();
                        //let userId = userDocData.userId;
                        userData = userDoc.data();
                      //  console.log(userData);
                        var s = userData.sold;
                        if(s == "false")
                        {
                            l.push({ data: userData, unitId: userDoc.id, sold: s ,monthly:userData.price});
                        }
                        else{
                        // Create promises for each user to retrieve sub projects and do further operation on them.
                            let perUserPromise;
                            if(req.params.typeIn == "price" || req.params.typeIn == "rooms"){
                                perUserPromise = admin.firestore().collection('Transactions').where('unitid', '==', userDoc.id).get().then((projects) => {

                                    // For every project, get the project Id and use it to retrieve the sub project.
                                    let getSubProjectsPromises = [];
                                    projects.forEach((projDoc) => {
                                        var projData =projDoc.data();
                                        
                                        if (req.params.typeIn == "rooms" || req.params.typeIn == "price" || req.params.typeIn == "0")
                                        {
                                            sum+= projData.billTotal;
                            //               console.log('added');
                                        }
                                        l.push({ data: projData, unitId: userDoc.id, sold: s,rooms:userData.rooms ,monthly:userData.price});
                                    // getSubProjectsPromises.push(database.collection("users").doc(userId).collection("projects").doc(projectId).collection("subProjects").get());
                                    });

                                    // Resolve and pass result to the following then()
                                    return Promise.all(getSubProjectsPromises);

                                    });
                            }
                            else if(req.params.typeIn == "priceT"){
                                perUserPromise = admin.firestore().collection('Transactions').where('unitid', '==', userDoc.id).where("billTotal", '>=', Number(req.params.fromFilter))
                                .where("billTotal", '<=', Number(req.params.toFilter)).get().then((projects) => {

                                    // For every project, get the project Id and use it to retrieve the sub project.
                                    let getSubProjectsPromises = [];
                                    projects.forEach((projDoc) => {
                                        var projData =projDoc.data();
                                        
                                        //if (req.params.typeIn == "rooms" || req.params.typeIn == "price" || req.params.typeIn == "0")
                                        //{
                                            sum+= projData.billTotal;
                            //               console.log('added');
                                        //}
                                        l.push({ data: projData, unitId: userDoc.id, sold: s,rooms:userData.rooms ,monthly:userData.price});
                                    // getSubProjectsPromises.push(database.collection("users").doc(userId).collection("projects").doc(projectId).collection("subProjects").get());
                                    });

                                    // Resolve and pass result to the following then()
                                    return Promise.all(getSubProjectsPromises);

                                    });
                            }
                            userPromises.push(perUserPromise);
                        }
                    });

                    // Start the operation and wait for results
                    await Promise.all(userPromises).then(()=>{
                      //  console.log(sum);
                        res.render("history.ejs",{l:l,totalSum:sum});
                    });
                })();

            } else {
                res.render("index.html");
            }
        })
        .catch((error) => {
            res.render("index.html");
        });
});

app.get("/renter/requests", async (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "renter" || req.cookies.role === "Admin") {
                (async () => {
                    let l=[];
                    let users = await admin.firestore().collection('units').where('rid', '==', req.cookies.uid).get();

                    let userPromises = [];
                    users.forEach((userDoc) => {
                        //let userDocData = userDoc.data();
                        //let userId = userDocData.userId;

                        // Create promises for each user to retrieve sub projects and do further operation on them.
                        let perUserPromise = admin.firestore().collection('requestPayment').where('unitid', '==', userDoc.id).get().then((projects) => {

                            // For every project, get the project Id and use it to retrieve the sub project.
                            let getSubProjectsPromises = [];
                            projects.forEach((projDoc) => {
                                l.push({ id: projDoc.id, data: projDoc.data(), unitId: userDoc.id });
                               // getSubProjectsPromises.push(database.collection("users").doc(userId).collection("projects").doc(projectId).collection("subProjects").get());

                            });

                            // Resolve and pass result to the following then()
                            return Promise.all(getSubProjectsPromises);

                            });

                        userPromises.push(perUserPromise);
                    });

                    // Start the operation and wait for results
                    await Promise.all(userPromises).then(()=>{
                        res.render("rentTrack.ejs",{l:l});
                    });
                })();
            }
            else
                res.send("Not authorized!");
        })
        .catch((error) => {
            res.send("Not authorized!");
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
            //console.log(role);
            if (req.cookies.role === "student") {   
                (async () => {
                    let users = await admin.firestore().collection('units').where('sold', '==', "false").get();
                    let l=[];
                    let userPromises = [];

                    users.forEach((userDoc) => {
                        //let userDocData = userDoc.data();
                        //let userId = userDocData.userId;
                        var userData = userDoc.data();
                        var userId = userDoc.id;
                        //console.log(userData);

                            let perUserPromise = admin.firestore().collection('Attraction').where('unitid', '==', userDoc.id).get().then((projects) => {

                                // For every project, get the project Id and use it to retrieve the sub project.
                                let getSubProjectsPromises = [];
                                projects.forEach((projDoc) => {
                                    var projData =projDoc.data();

                                    l.push({ data: userData,id:userId, dataAtt : projData });
                                });

                                // Resolve and pass result to the following then()
                                return Promise.all(getSubProjectsPromises);

                                });

                            userPromises.push(perUserPromise);
                        }
                    );

                    // Start the operation and wait for results
                    await Promise.all(userPromises).then(()=>{
                      //  console.log(sum);
                      //  console.log(l);
                        res.render("student.ejs",{l:l});
                    });
                })();
              
              
              
              
                /*
                try {
                    var l = [];
                    var query = admin.firestore().collection('units').where('sold', '==', "false");
                    var allDocs = query.get().then(snapShot => {
                        snapShot.forEach(doc => {
                            l.push({ id: doc.id, data: doc.data() });
                        });

                        res.render("student.ejs", { l: l });
                    });
                } catch (error) {
                    return res.status(500).send(error);
                }*/

            }
            else
                res.redirect("/api/");
        })
        .catch((error) => {
            console.log(error);
            res.redirect("/api/");
        });
});



//verify permissions and render site to requester
app.get("/myCoupons", function (req, res)  {
    const sessionCookie = req.cookies.session || "";
    var role = req.cookies.role;
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)//checkRevoked
        .then(() => {
            if (req.cookies.role === "student") {   
                (async () => {
                    try{
                      //  return res.render("There are no cupons");
                   // console.log(req.cookies.uid);
                    let users = await admin.firestore().collection('Coupons').where('sid', '==', req.cookies.uid).get();
                    let l=[];
                    let userPromises = [];
                    users.forEach((userDoc) => {
                        var userData = userDoc.data();
                        l.push({data:userData,id:userDoc.id});
                    }
                    );
                    //console.log(req.cookies.uid);

                    //userPromises.push(users);
                    // Start the operation and wait for results
                    await Promise.all(userPromises).then(()=>{
                        //console.log(l);
                        res.render("myCoupons.ejs",{l:l});
                    }).catch((error)=>{
                        console.log("WPW2");

                       // res.render("There are no cupons");
                    });
                    }catch(error){
                        console.log("WPW");


                    }
                })();

            }
            else
                res.redirect("/api/");
        })
        .catch((error) => {
            console.log(error);
            res.redirect("/api/");
        });
});



app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/api/");
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
                        var roleA = "";
                        if (req.body.lPerm === "student") {
                            roleA = "Verify";
                            var check = admin.firestore().collection('users').doc(req.body.uid).set({
                                email: req.body.email,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                perm: "Verify",
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
                            roleA = "renter";
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
                        res.cookie('role', roleA);
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








//Get a renter's units requests
app.post('/renterLease', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked*/)
        .then(() => {
            if (req.cookies.role === "renter" || req.cookies.role === "Admin") {
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
                    var query2 = admin.firestore().collection('users').doc(req.body.uid).update({
                        perm: "student"
                    });
                }
                else if (req.body.flag == "false") {
                    var query5 = admin.firestore().collection('requests').doc(req.body.uid).delete();
                    var query6 = admin.firestore().collection('users').doc(req.body.uid).delete();
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
            if (req.cookies.role === "renter" || req.cookies.role === "Admin") {
                if (req.body.flag == "true") {
                   // console.log(req.body);
                    var couponP=20;
                    var bill =req.body.totalBill;
                    if(bill>5000) couponP = 35;
                    else if(bill>8000) couponP = 50;
                    var queryCoupon = admin.firestore().collection('Coupons').add({
                        sid:req.body.sid,
                        discount:couponP
                    });
                    var query = admin.firestore().collection('requestPayment').doc(req.body.uid);
                    //var storageRef = firebaseApp.storage().ref();
                    var allDocs = query.get().then(doc => {
                        var query4 = admin.firestore().collection('units').doc(doc.data().unitid).update({
                            sold: "true"
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
                        return res.json({ status: 'OK' });
                    });
                }
                else if (req.body.flag == "false") {
                 //   console.log(req.body.uid);
                    var query6 = admin.firestore().collection('requestPayment').doc(req.body.uid).delete();
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ status: 'OK' });

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
    const sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => {
            if (req.cookies.role == "student") {
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
            } else {
                res.send("not authorized access");
            }
        })
        .catch((error) => {
            res.redirect("/api/");
        });
});


//request all units Sort
app.get('/requestUSort/:action/:colName/:fromLower/:toHigher', (req, res) => {
    const sessionCookie = req.cookies.session || "";
   // console.log('dmg check');
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => {
            if (req.cookies.role == "student") {
                (async () => {
                    let users ;
                    let l=[];
                    let userPromises = [];
                    if (req.params.action == "sort") {
                        if (req.params.fromLower == "desc") {
                            users = await admin.firestore().collection('units').where("sold", "==", "false").orderBy(req.params.colName, 'desc').get();
                        } else {
                            users = await admin.firestore().collection('units').where("sold", "==", "false").orderBy(req.params.colName).get();
                        }
                    }
                    else if (req.params.action == "filter") {
                        //query =  admin.firestore().collection('units').where(req.body.colName,'>=',req.body.lowerValue)
                        //.where(req.body.colName,'<=',req.body.higherValue);
                        users = await admin.firestore().collection('units').where("sold", "==", "false").where(req.params.colName, '>=', Number(req.params.fromLower))
                            .where(req.params.colName, '<=', Number(req.params.toHigher)).get();
                    }
                    //console.log(users);
                    users.forEach((userDoc) => {
                        //let userDocData = userDoc.data();
                        //let userId = userDocData.userId;
                        var userData = userDoc.data();
                        var userId = userDoc.id;
                        //console.log(userData);
                        l.push({ data: userData,id:userId}); //, dataAtt : projData 
                            let perUserPromise = admin.firestore().collection('Attraction').where('unitid', '==', userDoc.id).get().then((projects) => {

                                // For every project, get the project Id and use it to retrieve the sub project.
                                let getSubProjectsPromises = [];
                                projects.forEach((projDoc) => {
                                    var projData =projDoc.data();
                                    l.forEach((obj)=>{
                                        if(obj.id == userId)
                                            {
                                                obj["dataAtt"] = projData;
                                            }
                                    });
                                    //l.push({ data: userData,id:userId, dataAtt : projData });
                                });

                                // Resolve and pass result to the following then()
                                return Promise.all(getSubProjectsPromises);

                                });

                            userPromises.push(perUserPromise);
                        }
                    );

                    // Start the operation and wait for results
                    await Promise.all(userPromises).then(()=>{
                      //  console.log(sum);
                      //  console.log(l);
                        res.render("student.ejs",{l:l});
                    });
                })();
              
            }
            else
                res.send("not authorized");
        })
        .catch((error) => {
            res.redirect("/api/");
        });
});


//request all units 
app.post('/requestOrder', (req, res) => {
    const sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => {
            if (req.cookies.role == "student") {
                var query = admin.firestore().collection('requestPayment').add({
                    email: req.body.email,
                    billTotal: Number(req.body.billTotal),
                    endDate: new Date(req.body.endDate),
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    phoneNumber: req.body.phoneNumber,
                    sId: req.cookies.uid,
                    startDate: new Date(req.body.startDate),
                    unitid: req.body.unitid,
                    ccFirstName: req.body.ccFirstName,
                    ccLastName: req.body.ccLastName,
                    ccNumber: req.body.ccNumber,
                    ccSec: req.body.ccSec,
                    ccExp: req.body.ccExp,
                    ccPostal: req.body.ccPostal
                });
                res.setHeader('Content-Type', 'application/json');
                return res.json({ status: 'OK' });
            }
            else
                res.send("not authorized");
        })
        .catch((error) => {
            res.redirect("/api/");
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
                  //  console.log(req.body);
                    if (req.cookies.role == "renter") {
                        var check2 = admin.firestore().collection('units').doc(req.body.unitId).update({
                            location: req.body.location,
                            endDate: new Date(req.body.endDate),
                            ownerName: req.body.ownerName,
                            phoneNumber: req.body.phoneNumber,
                            price: Number(req.body.price),
                            rating: req.body.rating,
                            rooms: Number(req.body.rooms),
                            startDate: new Date(req.body.startDate),
                            minDate: new Date(req.body.minDate),
                            description: req.body.description
                        }).then(() => {
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
                //console.log(req.body);
                // console.log(new Date(req.body.minDate));

                var check2 = admin.firestore().collection('units').add({
                    location: req.body.location,//1
                    endDate: new Date(req.body.endDate),//1
                    ownerName: req.body.ownerName,      //1
                    phoneNumber: req.body.phoneNumber,  //1
                    price: Number(req.body.price),      //1
                    rating: Number(req.body.rating),            //1
                    rooms: Number(req.body.rooms),      //1
                    startDate: new Date(req.body.startDate),       //1
                    hasPictures: req.body.hasPictures, //1
                    minDate: new Date(req.body.minDate), //1
                    sold: "false",
                    rid: req.cookies.uid,
                    description: req.body.description
                }).then(function(docRef)  {
                    //var keys = [ req.body.uid.toString(),req.body.lPerm.toString() ]
                    var query3 = admin.firestore().collection('Attraction').add({
                        unitid:docRef.id,
                        Names:req.body.AttNames,
                        Prices:req.body.attPrices,
                        hasPicturesAttr:req.body.hasPicturesAttr
                    })
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
app.use('/images', express.static("images"));
app.use('/css', express.static("css"));
//define google cloud function name
//export const webApi = functions.https.onRequest(app);
/*
const api = functions.https.onRequest(app)

module.exports = {
  api
}*/

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
