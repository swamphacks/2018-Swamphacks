// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


// When a new user is added under applicants
exports.subscribeUser = functions.database.ref('applicants/{id}').onCreate(event => {

  var user = event.data.val();
  var id = event.params.id;
  var fetch = require('isomorphic-fetch');
  var btoa = require('btoa');

  // Exit if the user was deleted or the user is currently subscribed
  // if (!event.data.exists() || user.subscribed) {
  //   return
  // }

  function createFetch() {

    var url = 'https://us10.api.mailchimp.com/3.0/lists/fda6f8d99c/members';
    var method = 'POST';
    var headers = {
      'Authorization': 'randomUser MAILCHIMP_API_KEY',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    var body = JSON.stringify(

      {
        // Adding just email
        email_address: user.email,
        status: 'subscribed'

        // Adding email and name (want to see if above works first)
        // email_address: user.email,
        // status: 'subscribed',
        // merge_fields: {
				// 	FNAME: fname,
				// 	LNAME: lname
				// }
      }

    );

    return fetch(url, {
      method,
      headers,
      body
    }).then(resp => resp.json()).then(resp => {
      console.log(resp)
      admin.database().ref('applicants/' + id + '/subscribedToMail').set("true");
    });
  }

  return createFetch();

})
