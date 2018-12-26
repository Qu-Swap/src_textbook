function insertData(postReq, tableID) {
  var ajax =  new XMLHttpRequest();

  var form = document.getElementById("inputForm");
  var data = new FormData(form);

  ajax.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      if(tableID === "sellTable") {
        sellData = data;
      }
      else {
        buyData = data;
      }

      loadTableData(tableID);
    }
  }

  var dataStr = data_to_string(data);
  if(bookVal === "new") {
    var bookForm = document.getElementById("bookForm");
    var bookData = new FormData(bookForm);
    dataStr += "&" + data_to_string(bookData);
    bookForm.reset();
  }
  else if(bookVal !== "na"){
    dataStr += "&book_id=" + bookVal;
  }
  else {
    alert("Please select a textbook.")
    return;
  }

  ajax.open("POST", postReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajax.send(dataStr);
  form.reset();
}

function updateData() {
  try {
    switch(dropVal) {
      case "sell":
        insertData(SELLREQUEST[0], SELLREQUEST[1]);
        break;
      case "buy":
        insertData(BUYREQUEST[0], BUYREQUEST[1]);
        break;
    }
  }
  catch(e) {
    alert("Error updating data!");
    console.log(e.title + "\n" + e.messsage);
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
