function insertData(postReq, tableID) {
  var ajax = basic_request(postReq, tableID);

  var form = document.getElementById("inputForm");
  var data = new FormData(form);

  var dataStr = data_to_string(data);

  /* If the user is at the last search state (i.e. the confirmation thing) and
  was at the new book details form previously */
  if(searchState === TOTALSEARCHSTATES && prevSearchState === TOTALSEARCHSTATES - 1) {
    var bookForm = document.getElementById("bookForm");
    var bookData = new FormData(bookForm);

    if(!validate_book_form(bookData)) return;

    dataStr += "&" + data_to_string(bookData) + "&subject_id=" + subjectID;
  }
  // If the user came directly from 2 states ago – selected existing book
  else if(searchState === TOTALSEARCHSTATES && prevSearchState === TOTALSEARCHSTATES - 2){
    dataStr += "&book_id=" + selectBookInfo["uuid"];
  }
  else {
    alert("Please select a textbook.")
    return;
  }

  if(!validate_offer_form(data)) return;

  ajax.open("POST", postReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajax.send(dataStr);

  if(bookForm) {
    bookForm.reset();
  }
  form.reset();

  update_search_layout(1);
}

// A very basic search request
function search_data(postReq, tableID) {
  var ajax = basic_request(postReq, tableID);

  var form = document.getElementById("searchBar");
  var data = new FormData(form);

  var dataStr = data_to_string(data);

  ajax.open("POST", postReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajax.send(dataStr);

  form.reset();
}

// The basic format for a POST request which populates one of the tables
function basic_request(postReq, tableID) {
  var ajax = new XMLHttpRequest;

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
        /* Search through the opposite table as the conventional name meaning, this is
        confusing due to a change in terminology midway through the project */
        switch(state) {
          case STATES.BUY:
            search_data(SELLREQUEST[2], SELLREQUEST[1]);
            break;
          case STATES.SELL:
            search_data(BUYREQUEST[2], BUYREQUEST[1]);
            break;
        }
        break;
    }
  }

  catch(e) {
    alert("Error updating data!");
    console.log(e.title + "\n" + e.messsage);
  }
}


function searchTextbooks(postReq, tableID) {
  var ajax =  new XMLHttpRequest();

  var form = document.getElementById("searchForm");
  var data = new FormData(form);
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
  form.reset();
}

// Update the book list using a column among book name, isbn, or author
function updateBookList() {
  try {
    searchTextbooks("postSearchData", "queriedBooks");
    update_search_layout(2);
  }
  catch(e) {
    alert("Error searching for textbooks.")
  }
}

function data_to_string(formData) {
  var str = "";

  var c = 0;
  for(var pair of formData) {
    if(c != 0) str += "&";
    else c = 1;

    str += pair[0] + "=" + pair[1];
  }

  return str;
}
