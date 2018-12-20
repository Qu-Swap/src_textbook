function removeData(deleteReq, tableID, rownum, password) {
  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      if(!this.responseText) {
        alert("Incorrect password.")
      }
      else {
        loadData(this, tableID);
      }
    }
  }

  ajax.open("POST", deleteReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  ajax.send("rowid="+(rownum).toString() + "&password=" + password);
}

function deleteData(deleteReq, tableID, rownum) {
  var password = prompt("Please input the password.");

  try {
    removeData(deleteReq, tableID, rownum, password);
  }
  catch(e) {
    alert("Error deleting data!");
    console.log(e.title + "\n" + e.messsage);
  }
}
