function removeData(deleteReq, tableID, id, password) {
  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(this.readyState == 4) {
      if(this.status == 200) {
        if(!this.responseText) {
          display_message(MESSAGES.PASS, true);
        }
        else {
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
      else if(this.status == 269) {
        display_message(MESSAGES.ERR);
        updateData("refresh");
      }
    }
  }

  ajax.open("POST", deleteReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  ajax.send("id=" + id + "&password=" + remove_special(password));
}

function deleteData(deleteReq, tableID, id) {
  var password = prompt("Please input the password.");
  if(password === null) {return};

  try {
    removeData(deleteReq, tableID, id, password);
  }
  catch(e) {
    display_message(MESSAGES.ERR, true);
    console.log(e.title + "\n" + e.messsage);
  }
}
