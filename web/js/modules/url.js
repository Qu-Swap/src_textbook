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

function display_message(box, text, msg) {
	box.css("display", "");
	box.removeClass("hide");
	text.removeClass("fail");

	switch (msg) {
		case MESSAGES.CREATE_OFFER:
			text.html("Offer was created successfully!");
			break;
		case MESSAGES.CREATE_REQUEST:
			text.html("Request was created successfully!");
			break;
		case MESSAGES.DELETE:
			text.html("Listing was deleted successfully!");
			break;
		case MESSAGES.BOOK:
			text.html("Choose a textbook first.");
			break;
		case MESSAGES.PASS:
			text.html("Bad password.");
			text.addClass("fail");
			break;
		case MESSAGES.ERR:
			text.html("An error occurred.");
			text.addClass("fail");
			break;
		case MESSAGES.NET:
			text.html("A network error occurred.");
			text.addClass("fail");
			break;
		default:
			box.css("display", "none");
	}

}
function hideMessage(box) {
	// So that on reload the message will still be gone
	var url = window.location.href.split(/[?#]/)[0];
	window.history.replaceState({}, document.title, `${url}?state=${state}`);
	// Add a class to the messagebox so that it will hide
	box.addClass("hide");
	box.on("transitionend", function() {
		box.css("display", "none");
	});

}