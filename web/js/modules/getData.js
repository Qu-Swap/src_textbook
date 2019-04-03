getDataModule = function() {
  var sellData;
  var buyData;
  var subjectData;
  var queriedBookData;
  var tableSort = {key: null, desc: false};

  var loaded = [];

  // Basic format of GET request, will be better integrated someday
  function basic_get(getReq, callback) {
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        callback(JSON.parse(this.responseText));
      }
    }

    ajax.open("GET", getReq, true);
    ajax.send();
  }

  /* Function to request data from the server, it currently waits before
  all responses are received before populating the html elements. This is done
  in case in the future elements will need data from multiple responses. As a
  result, the variable loaded keeps track of the number of responses received.
  Once it hits 3, we know that was the last response, and the elements can be
  populated */
  function requestData(getReq, elementID) {
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
        // Will make this a separate function someday as this code gets reused
        // Will also make it better
        var data = JSON.parse(this.responseText);
        switch(elementID) {
          case "sellTable":
            getDataModule.sellData = data;
            break;
          case "buyTable":
            getDataModule.buyData = data;
            break;
          case "subjectDown":
            subjectData = data;
            subjectID = subjectData[0]["uuid"];
            break;
        }

        getDataModule.loaded.push(elementID);

        // If all data has been loaded (indicating this is the last response)
        if (getDataModule.loaded.length == TOTALASSETS) {
      		for (element in getDataModule.loaded) {
      			var el = getDataModule.loaded[element];
      			switch(el) {
      				case "subjectDown":
      				  getDataModule.loadSelectData();
      				  break;
      				default:
      				  getDataModule.loadTableData(el);
      			}
      		}
        }
      }
    }

    ajax.open("GET", getReq, true);
    ajax.send();
  }

  function getData(getReq, elementID) {
    try {
      this.requestData(getReq, elementID);
    }
    catch (e) {
  	console.log(e);
      display_message(msgBox, msgText, MESSAGES.NET);
    }
  }

  // Creates multiple tables in a div element to show buying/selling offers
  function loadTableData(tableID) {
  	var data = ((tableID == "sellTable") ? this.sellData : this.buyData).slice();

  	var table = $("#" + tableID);
  	var htmlStr;

      if(data.length > 0) {
  		htmlStr = "<table class=\"omni table table-striped table-bordered\">\
  					   <thead><tr><th class='sort table-bookName' data-sort='bookName'>Textbook Name</th>";
  		if (tableID === "sellTable") {
  			htmlStr += "<th class='sort table-name' data-sort='name'>Seller Name</th>"
  		} else {
  			htmlStr += "<th class='sort table-name' data-sort='name'>Buyer Name</th>"
  		}

  		htmlStr += "<th class='sort table-price' data-sort='price'>Price</th>\
  		<th class='sort table-email' data-sort='email'>Contact Email</th>\
  		<th class='table-tags'>Tags</th>\
  		<th class='table-actions'>Actions</th>\
  		</tr></thead><tbody>";

  		if (tableSort.key && data[0].hasOwnProperty(tableSort.key)) {
  			// Sort the table data by a given key
  			// It's OK to lose the original order of `data` because it's just copied from `buyData` or `sellData`
  			data.sort((a, b) => a[tableSort.key] > b[tableSort.key] ? 1 : -1);
  			if (tableSort.desc) data.reverse();
  		}
  		for (let currentEntry of data) {

  		  htmlStr += `<tr>
  		  <td class="table-bookName">${currentEntry["bookName"]}</td>
  		  <td class="table-name">${currentEntry["name"]}</td>
  		  <td class="table-price">$${currentEntry["price"]}</td>
  		  <td class="table-email">${currentEntry["email"]}</td>
  		  <td class="table-tags" id='${currentEntry["uuid"]}'></td>
  		  <td class='btn-actions table-actions'><a class='btn-small' href="details.html?${currentEntry["uuid"]}"><i class='fas fa-ellipsis-h'></i></a>
  		  <a class='btn-small' href='mailto:${currentEntry["email"]}'><i class='fas fa-reply'></i></a>
  		  <a class='btn-small delete' onclick="deleteDataModule.successPrompt('${currentEntry["uuid"]}', this)"><i class='fas fa-trash-alt'></i></a</td>
  		  </tr>`;
  		}

  		htmlStr += "</tbody></table>";
  	}
  	else {
  		htmlStr = "<table class=\"omni table table-striped table-bordered empty\"><tr><td>No offers so far!</td></tr></table>";
  	}

    table.html(htmlStr);
    if (tableSort.key) {
  	  table.find(`th.sort i`).remove()
  	  var icon = $(document.createElement("i"));
  	  icon.addClass("fas sort-icon");
  	  icon.addClass(tableSort.desc ? "fa-caret-down" : "fa-caret-up");
  	  table.find(`th.sort[data-sort='${tableSort.key}']`).append(icon);

    }

    // Add sorting options to the header
    table.find('th.sort').click(function (){
  	// We want the sort to cycle through three states
  	if (tableSort.key != this.dataset.sort) {
  		// col is the new sort
  		tableSort.key = this.dataset.sort;
  		tableSort.desc = false;
  	}
  	else {
  		if (!tableSort.desc) {
  			tableSort.desc = true;
  		} else {
  			tableSort.key = null;
  		}
  	}
  	this.loadTableData(tableID);
    });
    /* Populate tags after html is loaded, just in case the textbook request happens
    faster than the stringbuilder by some miracle */
    for (let entry of data) {
      tags.populate_tags(entry["book_id"], entry["uuid"]);
    }
  }

  function loadSelectData() {
    var data = subjectData;
    var htmlStr = "";
    var inner = "subjectName";

    for (let currentEntry of data) {
      htmlStr += `<option value="${currentEntry["uuid"]}">${currentEntry[inner]}</option>`;
    }

    subjectDown.html(htmlStr);
  }

  // Populates a single table with textbook search results
  function loadSearchedTextbooks(tableID) {
    var table = $(`#${tableID}`);
    var htmlStr = "";

    if(this.queriedBookData.length > 0) {
      htmlStr += "<thead><tr><th>Textbook Name</th>\
      <th>Author</th>\
      <th>ISBN</th>\
      <th>Edition/Copyright</th>\
      <th>Select</th>\
      </tr></thead>\
  	<tbody>";

      for(var i = 0; i < this.queriedBookData.length; i++) {
        var currentEntry = this.queriedBookData[i];

        htmlStr += `<tr>
        <td>${currentEntry["bookName"]}</td>
        <td>${currentEntry["author"]}</td>
        <td>${currentEntry["isbn"]}</td>
        <td>${currentEntry["edition"]}</td>
        <td><a class='btn-small' onclick="main.set_book_info(${i})"><i class='fas fa-arrow-right'></i></a></td>
        </tr>`;
      }
  	table.removeClass("empty");
    }
    else {
      htmlStr += "<tr><td>No textbooks found</td></tr>";
  	table.addClass("empty");
    }

    table.html(htmlStr);

  }

  function get_subject_name(subjectID) {
    for (let currentEntry of subjectData) {
      if(currentEntry["uuid"] === subjectID) {
        return currentEntry["subjectName"];
      }
    }
  }

  return {
    // Public variables
    sellData: sellData,
    buyData: buyData,
    subjectData: subjectData,
    queriedBookData: queriedBookData,
    tableSort: tableSort,
    loaded: loaded,

    // Public functions
    basic_get: basic_get,
    requestData: requestData,
    getData: getData,
    loadTableData: loadTableData,
    loadSelectData: loadSelectData,
    loadSearchedTextbooks: loadSearchedTextbooks,
    get_subject_name: get_subject_name
  }
}();

