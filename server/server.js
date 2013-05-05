<<<<<<< HEAD
/**
 * Module dependencies.
 */

// var express = require('express')
//   , app = express()
//   , server = require('http').createServer(app);

// server.listen(3000);
// console.log('Express server listening on port 3000');

// // Config

// app.use(express.favicon());
// // app.use(express.logger('dev'));
// app.use(express.bodyParser());
// app.use(express.methodOverride());
// app.use(cookieParser);
// app.use(express.session({ secret: secret, store: store }));
// app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }

// // Routes

// app.get('/', );
=======
Meteor.startup(function () {
 // code to run on server at startup
});

Meteor.methods({
	authenticate: function(param) {
		console.log("Arrived at Meteor.methods.authenticate with", param);
		//Meteor Client release
		this.unblock();
		//Client call to Singly to get Auth code w/o Secret
		var result = Meteor.http.post("https://api.singly.com/oauth/access_token", {
			params: {
				'client_id': "41a209b08b207c9c34f64e1332629e55",
				'client_secret': "6d8e13ee9eafa2a8761aee09f127ea0c", 
				code: param.code
			}
		});
		console.log("Heard back from Singly", result.data);
		if (result.statusCode === 200) {
			return result.data;
		}
	},
	getFBPics: function(token) {
		this.unblock();
		console.log("Asking for pics from Singly");
		var result = Meteor.http.get("https://api.singly.com/friends/facebook", {
			params: {
				'access_token': token
			},
			query: "full=true"
		});
		console.log("Singly Sends Pics: ", result);
		if (result.statusCode === 200) {
			return _(result.data).map(function(friend) {
				return friend.full.facebook.data.picture.data.url;
			});
		}
	}
});
>>>>>>> 7099c9f9002c9047731c7da6b9d8d03b30dac7d8
