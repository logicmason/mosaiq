Template.header.bannerURL = function () {
	return "assets/MOSAIQME.jpg";
};

Template.header.events({
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  }
});