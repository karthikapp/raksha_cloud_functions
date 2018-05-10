const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// Load the full build.
var _ = require('lodash');
// Load the core build.
//var _ = require('lodash/core');
// Load the FP build for immutable auto-curried iteratee-first data-last methods.
// var fp = require('lodash/fp');
 
// // Load method categories.
// var array = require('lodash/array');
// var object = require('lodash/fp/object');
 
// // Cherry-pick methods for smaller browserify/rollup/webpack bundles.
// var at = require('lodash/at');
// var curryN = require('lodash/fp/curryN');

admin.initializeApp();
var db = admin.database();

var transporter = nodemailer.createTransport(smtpTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	auth: {
		user: 'karthik.uic@gmail.com',
		pass: 'KarthiGate1588'
	}
}));

exports.sendMailto = functions.database.ref('/leads/{leadId}/leadstatus')
.onUpdate((change,context) => {
	var leadID = context.params.leadId
	var leadsref = '/leads' + '/' + String(leadID) 
	var original = change.before.val();
	var new_value = change.after.val();
	var leaddb = db.ref(leadsref)
	var presalesheadids = []
	leaddb.on("value",(event) => {
		var leaddetails = event.val();
		//console.log("lead", leaddetails)

		var new_assignedto = leaddetails.assigned_to;
		var new_reportsto = leaddetails.reports_to;
		//console.log("1", new_assignedto, new_reportsto);

		if (new_value == 'Qualified-awaiting-presales')
		{ 
			db.ref('/user').orderByChild('role').equalTo('presaleshead')
			.once('value').then(snapshot => {
				//console.log("snapshot value" , snapshot.val())
				var objectKeysArray = Object.keys(snapshot.val())
				objectKeysArray.forEach(function(objKey) {
					var objValue = snapshot.val()[objKey]
					presalesheadids.push(objValue.email)
					//console.log('email',objValue.email)
				})
			}).then(val => {
				var test = ['karthik@zingr.org']
				presalesheadids = presalesheadids.concat(test)
				console.log("emails now nj", presalesheadids.join(),  presalesheadids )
				console.log("12", _.uniq(presalesheadids))
				var uniqemails = _.uniq(presalesheadids)
				var emails = uniqemails.join()
				const mailOptions = {
					from: 'karthik.uic@gmail.com', // sender address
					to: emails, // list of receivers
					subject: 'A new lead has been qualified - Test', // Subject line
					text: "Hi, You have a new lead which has been qualified.",
					html: "<h4> New Lead Qualified </h4>" 
				};

				transporter.sendMail(mailOptions,  (err, info) => {
					if(err)
						console.log("error from sendgrid",err)
					else
						console.log("sent by new ",info);
					});

				presalesheadids = []

			})

		}
		else if(new_value == 'Qualified')
		{
			var assgnto = '/user/' + new_assignedto + '/email'
			db.ref(assgnto)
			.once('value', (snapshot) => {
				var new_email_assgn = snapshot.val();
				//console.log("2", new_email_assgn)
				const mailOptions = {
					from: 'karthik.uic@gmail.com', // sender address
					to: new_email_assgn, // list of receivers
					subject: 'A new lead has been qualified - Test', // Subject line
					text: "Hi, You have a new lead which has been qualified.",
					html: "<h4> New Lead Qualified </h4>" 
				};

				transporter.sendMail(mailOptions,  (err, info) => {
					if(err)
						console.log("error from sendgrid",err)
					else
						console.log("sent by new ",info);
				});
			})
		}
		else if(new_value == 'Qualified-awaiting-manager')
		{
			var repoto = '/user/' + new_reportsto + '/email';
			db.ref(repoto)
			.once('value', (snapshot) => {
				var new_email_repo = snapshot.val();
				//console.log("3", new_email_repo)
				const mailOptions = {
					from: 'karthik.uic@gmail.com', // sender address
					to: new_email_repo, // list of receivers
					subject: 'A new lead has been qualified - Test', // Subject line
					text: "Hi, You have a new lead which has been qualified.",
					html: "<h4> New Lead Qualified </h4>" 
				};

				transporter.sendMail(mailOptions,  (err, info) => {
					if(err)
						console.log("error from sendgrid",err)
					else
						console.log("sent by new ",info);
				});
			})
		}
		else
		{
			return '';
		}
		
	})

	return 'Completed'
})
		
