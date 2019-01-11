var STATES = Object.freeze({BUY: "buy", SELL: "sell"});
var MESSAGES = Object.freeze({CREATE: "create", DELETE: "delete", NONE:"none"});

function QueryStringToJSON() {            
    var pairs = location.search.slice(1).split('&');
    
    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}