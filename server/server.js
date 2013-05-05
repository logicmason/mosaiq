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

		var fbResponse = Meteor.http.get("https://api.singly.com/proxy/facebook/me", {
			params: {
				'access_token': token
			},
			query: "fields=name,picture.type(large),friends.fields(picture.type(square))"
		});
		if (fbResponse.statusCode === 200) {
			// console.log("Singly Sends fB Data for: %d \n Main Image URL: %d \n and %d thumbs", 
			// 	fbResponse.data.name, fbResponse.data.picture.data.url, fbResponse.data.friends.data.length);
			return [
				fbResponse.data.name, 
				fbResponse.data.picture.data.url, 
				fbResponse.data.friends.data.map(function(friend) {
					return friend.picture.data.url;
				})
			];
		} else console.log('Singly/Facebook (or more likely RP) fucked up: %d', fbResponse);
	},
	getProfileImg: function(token) {
		this.unblock();
		console.log("Asking for pics from Singly");

		var singlyResponse = Meteor.http.get("https://api.singly.com/profile", {
			params: {
				'access_token': token
			},
		});
		if (singlyResponse.statusCode === 200) {
			// console.log("Singly Sends fB Data for: %d \n Main Image URL: %d \n and %d thumbs", 
			// 	fbResponse.data.name, fbResponse.data.picture.data.url, fbResponse.data.friends.data.length);
			return singlyResponse.data.thumbnail_url;
		} else console.log('Singly (or more likely RP) fucked up: %d', singlyResponse);
	},
	getSinglyPics: function(token) {
		this.unblock();
		console.log("Asking for pics from Singly");

		var singlyResponse = Meteor.http.get("https://api.singly.com/friends/all", {
			params: {
				'access_token': token,
				'limit': 2500,
				'full': false,
				'sort': 'interactions' 
			},
		});
		if (singlyResponse.statusCode === 200) {
			// console.log("Singly Sends fB Data for: %d \n Main Image URL: %d \n and %d thumbs", 
			// 	fbResponse.data.name, fbResponse.data.picture.data.url, fbResponse.data.friends.data.length);
			return singlyResponse.data.map(function(friend) {
					return friend.thumbnail_url;
			});
		} else console.log('Singly (or more likely RP) fucked up: %d', singlyResponse);
	}
});
