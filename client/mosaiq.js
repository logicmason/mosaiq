Template.header.bannerURL = function () {
	return "assets/MOSAIQME.jpg";
};

Template.greeting.events({
  'click .greeting' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined') {
      alert("Are you afraid?");
    }
  }
});