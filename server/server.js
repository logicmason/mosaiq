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