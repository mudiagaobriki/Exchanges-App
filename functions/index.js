// const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
// const fetch = require("node-fetch");
// import fetch from "node-fetch"
// import {onSnapshot, collection, addDoc, getDoc, doc, setDoc } from "firebase/firestore"
// import {firestore} from "../firebase";

const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);


// exports.sendPushNotification = functions.database.ref("appUsers")
exports.sendPushNotification =  functions.firestore.document("appUsers/{userID}")
    .onCreate((event) => {

        const root = event.data.ref.root
        let messages = []

        console.log("root: ", root)

        //return the main promise
        return root.once("value").then(function (snapshot) {

            snapshot.forEach(function (childSnapshot) {

                let expoToken = childSnapshot.val().expoToken

                if (expoToken) {

                    messages.push({
                        "to": expoToken,
                        "body": "New Note Added"
                    })
                }
            })

            return Promise.all(messages)

        }).then(messages => {
            const fetch = (...args) => import('node-fetch').then(({default: fetch}) => {

                fetch("https://exp.host/--/api/v2/push/send", {

                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(messages)
                })
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
        })

    })




