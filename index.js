// // // Create and Deploy Your First Cloud Functions
// // // https://firebase.google.com/docs/functions/write-firebase-functions
// //
// // exports.helloWorld = functions.https.onRequest((request, response) => {
// //  response.send("Hello from Firebase!");
// // });

// const functions = require('firebase-functions');

// const admin = require('firebase-admin');
// admin.initializeApp();

// const sgMail = require('@sendgrid/mail');

// console.log('FIREBASE_CONFIG is', process.env.FIREBASE_CONFIG);
// console.log('GCLOUD_PROJECT is', process.env.GCLOUD_PROJECT);

// const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
// console.log("1", firebaseConfig);

// const SENDGRID_API_KEY = functions.config().sendgrid.key;

// sgMail.setApiKey(SENDGRID_API_KEY);
// console.log("2", SENDGRID_API_KEY);

// exports.firestoreEmail = functions.firestore
//     .document('/users/{user}')
//     .onCreate(event => {

//     	console.log("5", event.params.user, event )
//         const userId = event.params.userId;
//         console.log("3", userId)

//         const db = admin.firestore();
//         console.log("4", db)

//         return db.collection('users').doc(userId)
//                  .get()
//                  .then(doc => {

//                     const user = doc.data()

//                     const msg = {
//                         to: 'krishwaj04@gmail.com',
//                         from: 'hello@angularfirebase.com',
//                         subject:  'New Follower',
//                         // text: `Hey ${toName}. You have a new follower!!! `,
//                         // html: `<strong>Hey ${toName}. You have a new follower!!!</strong>`,
            
//                         // custom templates
//                         templateId: 'your-template-id-1234',
//                         substitutionWrappers: ['{{', '}}'],
//                         substitutions: {
//                           name: user.displayName
//                           // and other custom properties here
//                         }
//                     };

//                     return sgMail.send(msg)
//                 })
//                 .then(() => console.log('email sent!') )
//                 .catch(err => console.log(err) )
                     

// });


// exports.helloWorld = functions.https.onRequest((request, response) => {
// 	console.log("executing mail")
//   	transporter.sendMail(mailOptions,  (err, info) => {
//    	if(err)
//      console.log("error from sendgrid",err)
//    	else
//      console.log(info);
// 	});

//  response.send("Hello from Firebase!");
// });


// exports.makeUppercase = functions.database.ref('/ionic/users/{userId}/email')
//     .onCreate((snapshot, context) => {
//       // Grab the current value of what was written to the Realtime Database.
//       const original = snapshot.val();
//       console.log('Uppercasing', context.params.userId, original);
//       const uppercase = original.toUpperCase();
//       // You must return a Promise when performing asynchronous tasks inside a Functions such as
//       // writing to the Firebase Realtime Database.
//       // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
//       return snapshot.ref.parent.child('uppercase').set(uppercase);
//     });


const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

admin.initializeApp();


var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'karthik.uic@gmail.com',
    pass: 'KarthiGate1588'
  }
}));

exports.sendMailto = functions.database.ref('/leads/{leadId}')
	.onUpdate((change,context) => {

		//const new_leadstatus = change.after.child("leadstatus").val();

		const original = change.before.val();
		const new_value = change.after.val();
		const new_leadstatus = new_value.leadstatus;
		const new_presalesapprovedby = new_value.presales_approved_by;
		const new_presalesapprovedto = new_value.presales_approved_to;
		const new_assignedto = new_value.assigned_to;

		var db = admin.database();
		var users = db.ref('/users/' + new_presalesapprovedto + '/email')

		users.on("value",(event) => {
			const new_email = event.val();
			const string_val = new_assignedto + 'has been qualified by'+ new_presalesapprovedto

				const mailOptions = {
				  from: 'karthik.uic@gmail.com', // sender address
				  to: new_email, // list of receivers
				  subject: 'Subject of your email', // Subject line
				  text: string_val // plain text body 
				};

			transporter.sendMail(mailOptions,  (err, info) => {
   				if(err)
     				console.log("error from sendgrid",err)
   				else
     				console.log(info);
				});

		})	

return "Completed";

	})