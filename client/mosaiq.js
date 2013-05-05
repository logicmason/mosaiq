var parseQueryString = function() {
	var oneParam, k, v, qs = {};
	_(window.location
			.search
			.replace("?", "")
			.split("&"))
			.each(function(param) {
				oneParam = param.split("=");
				qs[oneParam[0]] = oneParam[1];
	});
	return qs;
};

Meteor.call('authenticate', parseQueryString(), function(err, res) {
	Session.set('singly_account', res['access_token']);
	Session.set('singly_token', res['account']);
	Meteor.call('getFBPics', res['access_token'], function(err, res) {
		Session.set('picStash', res);
	});
});

Template.header.thing1 = function () {
	return "thing one";
};

Template.greeting.events({
  'click .greeting' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined') {
      alert("Are you afraid?");
    }
  }
});