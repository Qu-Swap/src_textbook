animate = function() {
  const time = 350;

  function fade(callback) {
    var box = document.getElementById("fadebox");

    box.style = "opacity: 0";
  	setTimeout(function() {
      box.style = "opacity: 1";

  		callback();
  	}, time);
  }

  return {
    fade: fade
  }
}();