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