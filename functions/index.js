/**
 * function name: message
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const handle = (res) => {
  console.log(res);
}
admin.initializeApp(functions.config().firebase);

exports.keyboard = functions.https.onRequest((req, res) => {
  //admin.initializeApp(functions.config().firebase);
  let keyboardObj = {
    "type": "buttons",
		"buttons":["안녕"]
  };
  res.send(keyboardObj);
});

exports.message = functions.https.onRequest((req, res) => {
	/* required variables */
	// parse request
  let user_key = decodeURIComponent(req.body.user_key); // user's key
  let type = decodeURIComponent(req.body.type); // message type
  let content = decodeURIComponent(req.body.content); // user's message
  console.log("received user_key: [" + user_key + "]")
  /* firebase admin and db initialization */
  //admin.initializeApp(functions.config().firebase);
  let db = admin.firestore();
  //let identifiedUser = null
  let qry = db.collection('userInfo').where('userKey','==',user_key).get()
      .then(snapshot => {
        if(snapshot.empty){
          throw new Error('No user found for {"userKey":' + user_key + '"}')
        } else if(snapshot.size === 1) { // two different account under same user_key exist on database issue an warning
          console.log("found a user: user key[" + user_key + "]")
          return snapshot.docs.toString()
        } else {          
          handle("multiple found")
          throw new Error('detected multiple of same user on database for { "userKey":' + user_key + '"}')
        }
      })
      .catch(err=> {
        console.log("Issue occured during user identification", err)
        return null;
      });
  let user = qry.then((result) => {
    let resMsg = ""
    if(result === null) {
       resMsg = "user NOT FOUND or ERROR OCCURED"
    } else {
      resMsg = "user FOUND" + result
    }
    let answer = {
			"message":{
				"text": resMsg
			}
	  }	
	  res.send(answer)
    return true;
  }).catch((err) => {
    let answer = {
			"message":{
				"text": "ISSUE HAPPEND DURING PROMISE"
			}
	  }	
	  res.send(answer)
    console.log(err)
  });

});


