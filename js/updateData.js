function insertData(postReq, tableID) {
  var ajax = new XMLHttpRequest();

  var form = $("#inputForm");
  var data = new FormData(form[0]);

  var dataStr = data_to_string(data);

  /* If the user is at the last search state (i.e. the confirmation thing) and
  was at the new book details form previously */
  if(searchState === TOTALSEARCHSTATES && prevSearchState === TOTALSEARCHSTATES - 1) {
    var bookForm = $("#bookForm");
    var bookData = new FormData(bookForm[0]);

    dataStr += "&" + data_to_string(bookData) + "&subject_id=" + subjectID;
  }
  // If the user came directly from 2 states ago – selected existing book
  else if(searchState === TOTALSEARCHSTATES && prevSearchState === TOTALSEARCHSTATES - 2){
    dataStr += "&book_id=" + selectBookInfo["uuid"];
  }
  else {
    display_message(MESSAGES.BOOK);
    return;
  }

  ajax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    var msgState = state === STATES.SELL ? MESSAGES.CREATE_OFFER : MESSAGES.CREATE_REQUEST;
		// Redirect the user to the success page
		window.location.href = "offers.html?state=" + state + "&msg=" + msgState;
	}
  };
  ajax.open("POST", postReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajax.send(dataStr);

/*   if(bookForm) {
    bookForm.reset();
  }
  form.reset();

  update_search_layout(1); */

}

// A very basic search request
function search_data(postReq, tableID) {
  var ajax = basic_request(tableID);

  var form = $("#offerSearch");
  var data = new FormData(form[0]);

  var dataStr = data_to_string(data);

  ajax.open("POST", postReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajax.send(dataStr);
}

// Refresh the data in a table
function refresh_data(getReq, tableID) {
  var ajax = basic_request(tableID);

  ajax.open("GET", getReq, true);
  ajax.send();
}

// The basic format for a POST request which populates one of the tables
function basic_request(tableID) {
  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      if(tableID === "buyTable") {
        buyData = data;
      }
      else {
        sellData = data;
      }

      loadTableData(tableID);
    }
  }

  return ajax;
}

function updateData(option) {
  try {
    switch(option) {
      case "insert":
        switch(state) {
          case STATES.BUY:
            insertData(BUYREQUEST[0], BUYREQUEST[1]);
            break;
          case STATES.SELL:
            insertData(SELLREQUEST[0], SELLREQUEST[1]);
            break;
        }
        break;
      case "search":
        // Search through both tables
        search_data(SELLREQUEST[2], SELLREQUEST[1]);
        search_data(BUYREQUEST[2], BUYREQUEST[1]);
        break;
      // Refresh the data through a fresh GET request from the database
      case "refresh":
        switch(state) {
          case STATES.BUY:
            refresh_data('getSellData', 'sellTable');
            break;
          case STATES.SELL:
            refresh_data('getBuyData', 'buyTable');
            break;
        }
        break;
    }
  }

  catch(e) {
	console.log(e);
    display_message(MESSAGES.NET);
  }
}


function searchTextbooks(postReq, tableID) {
  var ajax =  new XMLHttpRequest();

  var form = $("#searchForm");
  var data = new FormData(form[0]);
  var dataStr = data_to_string(data);

  ajax.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      queriedBookData = JSON.parse(this.responseText);

      loadSearchedTextbooks(tableID);
    }
  }

  ajax.open("POST", postReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajax.send(dataStr);
  form.trigger("reset");
}

// Update the book list using a column among book name, isbn, or author
function updateBookList() {
  try {
    searchTextbooks("postSearchData", "queriedBooks");
    update_search_layout(2);
  }
  catch(e) {
	console.log(e);
    display_message(MESSAGES.ERR);
  }
}

function data_to_string(formData) {
  var str = "";

  var c = 0;
  for(var pair of formData) {
    if(c != 0) str += "&";
    else c = 1;

    str += pair[0] + "=" + remove_special(pair[1]);
  }

  return str;
}

// Remove special characters (& and =) from query string
function remove_special(str) {
  return str.replace(/&/g, "%26").replace(/=/g, "%3D");
}
