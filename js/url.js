var STATES = Object.freeze({BUY: "b", SELL: "s"});
var MESSAGES = Object.freeze(
	{CREATE: "c",
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
	msgBox.style = "";
	msgBox.classList.remove("hide");
	msgText.classList.remove("fail");
	
	switch (msg) {
		case MESSAGES.CREATE:
			msgText.innerHTML = "Offer was created successfully!";
			break;
		case MESSAGES.DELETE:
			msgText.innerHTML = "Offer was deleted successfully!";
			break;
		case MESSAGES.BOOK:
			msgText.innerHTML = "Choose a textbook first.";
			break;
		case MESSAGES.PASS:
			msgText.innerHTML = "Bad password.";
			msgText.classList.add("fail");
			break;
		case MESSAGES.NET:
			msgText.innerHTML = "Choose a textbook first.";
			msgText.classList.add("fail");
			break;
		case MESSAGES.ERR:
			msgText.innerHTML = "An error occurred.";
			msgText.classList.add("fail");
			break;
		case MESSAGES.NET:
			msgText.innerHTML = "A network error occurred.";
			msgText.classList.add("fail");
			break;
		default:
			msgBox.style = "display: none";
	}
	msgBox.scrollIntoView({ block: "start", behavior: 'smooth' });
}
function hideMessage() {
	// So that on reload the message will still be gone
	var url = window.location.href.split(/[?#]/)[0];
	window.history.replaceState({}, document.title, url + "?state=" + state);
	// Add a class to the messagebox so that it will hide
	msgBox.classList.add("hide");
	msgBox.addEventListener("transitionend", function() {
		msgBox.style = "display: none";
	}, false);
	
}