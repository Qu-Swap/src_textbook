// Data module - concerns requests and responses
data = function() {
  var sellData = {}, buyData = {};  // Objects to hold requested selling and buying data
  var loaded = [];  // Array of strings to keep track of responses

  /* Callback function for get requests; it currently waits before
  all responses are received before populating the html elements. This is done
  in case in the future elements will need data from multiple responses. As a
  result, the variable loaded keeps track of the number of responses received.
  Once it hits TOTALASSETS, we know that was the last response, and the elements can be
  populated */
  function receive_response(response, elementID) {
    switch(elementID) {
      case "sellTable":
        this.sellData = response;
        break;
      case "buyTable":
        this.buyData = response;
        break;
    }

    this.loaded.push(elementID);
    if(this.loaded.length == TOTALASSETS) {
      // Once all data has been loaded, populate HTML elements
      console.log("temp")
    }
  }

  /* The simple get from the request module, with setting callbacks for each
  table, and also displays an error message on a failed request */
  function get(request, elementID) {
    try {
      request.get(request, function(object) {
        this.receive_response(response, elementID));
      });
    }
    catch (e) {
      console.log(e);
      display_message(msgBox, msgText, MESSAGES.NET);
    }
  }

  return {
    get: get
  }
}();