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

if (parseQueryString().code) {
	Meteor.call('authenticate', parseQueryString(), function(err, res) {
		Session.set('singly_account', res['access_token']);
		Session.set('singly_token', res['account']);
		Meteor.call('getFBPics', res['access_token'], function(err, res) {
			Session.set('picStash', res);
		});
	});	
};

Template.header.loggedIn = function() {
  var user = Session.get('singly_account');
  return !!user;
};

Template.greeting.events({
  // 'click .greeting' : function () {
  //   // template data, if any, is available in 'this'
  //   var mypic = new Image();
		// mypic.src = 'pic.jpg';
		// var canvas = $('<canvas>');
		// var ctx = canvas[0].getContext('2d');
		// ctx.drawImage(mypic, 0, 0);
		// data = ctx.getImageData(0,0,50,50).data;
		// console.log(data);
  //   console.log(calcAverageHue(data));
  // }
  'click. greeting' : function () {

  }
});

// breaks main pic data into hues
Template.greeting.processMainPic = function(data) {
	return pixelize(data).map(function(px) {
		return rgb2hsv(px.red, px.green, px.blue);
	});
};

var animateBanner = function() {
	$('.banner').css('margin-top', 0);
};

window.pixelize = function (data) {
	var len = data.length;
	if (len % 4 !== 0) throw ("invalid data, cannot pixelize");
	var pixels = [];
	for (var i = 0; i < data.length; i += 4) {
		pixels.push({
			red: data[i],
			green: data[i+1],
			blue: data[i+2],
			alpha: data[i+3]
		});
	}
	return pixels;
};

var getImageArray = function (src) {
  var canvas = $('<canvas>');
  var ctx = canvas[0].getContext('2d');
  var pic = new Image();
  pic.src = src;
  ctx.drawImage(pic, 0, 0);
  return ctx.getImageData(0,0,50,50).data;
};


var hueToXY = function (value) {
  value = value * Math.PI / 180;
  x = Math.cos(value);
  y = Math.sin(value);
  return [x, y];
};

var imageLibrary = {};
	imageLibrary.hash = {};
	imageLibrary.index = [];
	imageLibrary.numImages = function () {
  return imageLibrary.index.length;
};

var buildImageHueList = function (images) {
  var hue;
  var imageData;
  for (var i = 0; i < 360; i++) {
    imageLibrary.index.push([]);
  }
  for (var j = 0, l = images.length; j < l; j++) {
    imageData = getImageArray(images[j]);
    hues = calcAverageHue(imageData);
    while (hues in imageLibrary.hash) {
      hues += 0.0001;
    }
    imageLibrary.index.push(hues);
    imageLibrary.hash[hues] = images[j];
  }
  imageLibrary.index.sort();
};

var findBestPic = function (hue) {
  var counter = 0;
  var afterIndex;
  var beforeIndex;

  // check the index for the closest match to this hue
  while (imageLibrary.index[counter] && imageLibrary.index[counter] < hue) {
    counter++;
  }

  if (counter === 0) {
    afterIndex = 0;
    beforeIndex = imageLibrary.numImages() - 1;
  } else if (counter === imageLibrary.numImages()) {
    afterIndex = 0;
    beforeIndex = imageLibrary.numImages() - 1;
  } else {
    afterIndex = counter;
    beforeIndex = counter - 1;
  }

  var after = imageLibrary.index[afterIndex] - hue;
  var before = hue - imageLibrary.index[beforeIndex];
  if (after < before) {
    return imageLibrary.hash[imageLibrary.index[afterIndex]];
  } else {
    return imageLibrary.hash[imageLibrary.index[beforeIndex]];
  }
};

var calcAverageHue = function (array) {
  var hueArray = [];
  var hsvData;
  // var numPixels = array.length / 4;
  var iterations = 0;

  for (var i = 0, l = array.length; i < l; i += 4) {
    iterations++;
    hsvData = rgb2hsv(array[i], array[i+1], array[i+2]);
    // output.push(hsvData);
    hueArray.push(hsvData.h);
    // console.log(hsvData);
  }

  var polarArray = hueArray.map(hueToXY);
  var sumVector = polarArray.reduce(function (a, b) {
    return [a[0] + b[0], a[1] + b[1]];
  });

  var radians = Math.atan(sumVector[1] / sumVector[0]);
  if (radians < 0) {
    radians += 2 * Math.PI;
  }
  var averageHue = radians / Math.PI * 180;

  return averageHue;
};

window.rgb2hsv = function (red, green, blue) {
  var rr, gg, bb,
      r = red / 255,
      g = green / 255,
      b = blue / 255,
      h, s,
      v = Math.max(r, g, b),
      diff = v - Math.min(r, g, b),
      diffc = function(c){
          return (v - c) / 6 / diff + 1 / 2;
      };

  if (diff === 0) {
      h = s = 0;
  } else {
      s = diff / v;
      rr = diffc(r);
      gg = diffc(g);
      bb = diffc(b);

      if (r === v) {
          h = bb - gg;
      }else if (g === v) {
          h = (1 / 3) + rr - bb;
      }else if (b === v) {
          h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
          h += 1;
      }else if (h > 1) {
          h -= 1;
      }
  }
  return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
  };
};
