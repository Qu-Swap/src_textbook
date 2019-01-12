var STATES = Object.freeze({BUY: "b", SELL: "s"});
var MESSAGES = Object.freeze(
	{CREATE_OFFER: "c",
	 CREATE_REQUEST: "r",
	 DELETE: "d",
	 PASS: "p",
	 BOOK: "b",
	 NET: "n",
	 ERR: "e",
	 NONE:"0"
	});
function QueryStringToJSON() {
    var pairs = location.search.slice(1).split('&');

    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}

function display_message(msg) {
	msgBox.css("display", "");
	msgBox.removeClass("hide");
	msgText.removeClass("fail");

	switch (msg) {
		case MESSAGES.CREATE_OFFER:
			msgText.html("Offer was created successfully!");
			break;
		case MESSAGES.CREATE_REQUEST:
			msgText.html("Request was created successfully!");
			break;
		case MESSAGES.DELETE:
			msgText.html("Offer was deleted successfully!");
			break;
		case MESSAGES.BOOK:
			msgText.html("Choose a textbook first.");
			break;
		case MESSAGES.PASS:
			msgText.html("Bad password.");
			msgText.addClass("fail");
			break;
		case MESSAGES.NET:
			msgText.html("Choose a textbook first.");
			msgText.addClass("fail");
			break;
		case MESSAGES.ERR:
			msgText.html("An error occurred.");
			msgText.addClass("fail");
			break;
		case MESSAGES.NET:
			msgText.html("A network error occurred.");
			msgText.addClass("fail");
			break;
		default:
			msgBox.css("display", "none");
	}
	/*
    if ((msgBox.offset().top - $(window).scrollTop()) > window.innerHeight) {
		msgBox.scrollIntoView({ block: "start", behavior: 'smooth' });
    } */

}
function hideMessage() {
	// So that on reload the message will still be gone
	var url = window.location.href.split(/[?#]/)[0];
	window.history.replaceState({}, document.title, url + "?state=" + state);
	// Add a class to the messagebox so that it will hide
	msgBox.addClass("hide");
	msgBox.on("transitionend", function() {
		msgBox.css("display", "none");
	});

}