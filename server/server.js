Meteor.startup(function () {
 // code to run on server at startup
});

Meteor.methods({
	authenticate: function(param) {
		//Meteor Client release
		this.unblock();

		//Client call to Singly to get Auth code w/o Secret
		Meteor.http.post("http://api.singly.com/oauth/access_token", {
			params: {
				client_id: "41a209b08b207c9c34f64e1332629e55"
				client_secret: "6d8e13ee9eafa2a8761aee09f127ea0c", 
				code: param.code
			}
		}, function(err, res) {
			if (res.statusCode === 200) {
				Session.set('singly_token', res.access_token);
				Session.set('singly_account', res.account);
			}
		});
	}
});