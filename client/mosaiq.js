Meteor.Router.add({
	'/': function() {
		if (this.params.code) {
			Meteor.Methods.call('authenticate', {code: this.params.code}, function(err, res) {
				console.log(Session.get('singly_token'));
				console.log(Session.get('singly_account'));
			});
		}
	}
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