/**
 * function name: message
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */

const admin = require('firebase-admin');
const functions = require('firebase-functions');

exports.message = (req, res) => {
	/* required variables */
	// parse request
  let user_key = decodeURIComponent(req.body.user_key); // user's key
  let type = decodeURIComponent(req.body.type); // message type
  let content = decodeURIComponent(req.body.content); // user's message

  /* firebase admin and db initialization */
  admin.initializeApp(functions.config().firebase);
  var db = admin.firestore();
  let qry = db.collection('userInfo').where('userKey','==',user_key).get()
      .then(snapshot => {
        if(snapshot.length === 0) {
          console.log("user NOT FOUND!")
        } else if(snapshot.length === 1){
          console.log("user FOUND!" + snapshot[0])
        } else { // two different account under same user_key exist on database issue an warning
          return Promise.reject('detected multiple of same user on database for { "userKey":' + user_key + '"}')
        }
      })
      .catch(err=> {
        console.log("Issue occured during user identification", err)
      });
};


