Template.header.thing1 = function () {
	return "thing one";
};

Template.greeting.events({
  'click .greeting' : function () {
    // template data, if any, is available in 'this'
    var mypic = new Image();
		mypic.src = 'pic.jpg';
		var canvas = $('<canvas>');
		var ctx = canvas[0].getContext('2d');
		ctx.drawImage(mypic, 0, 0);
		data = ctx.getImageData(0,0,50,50).data;
		console.log(data);
  }
});


