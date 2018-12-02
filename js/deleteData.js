function removeData(deleteReq, tableID, rownum, password) {
  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      loadData(this, tableID);

      console.log(this.responseText);
      return this.responseText;
    }
  }

  ajax.open("POST", deleteReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  ajax.send("rowid="+(rownum).toString() + "&password=" + password);
}

function deleteData(deleteReq, tableID, rownum) {
  var password = prompt("Please input the password.");

  try {
    if(!removeData(deleteReq, tableID, rownum, password))
      alert("Incorrect password.")
  }
  catch(e) {
    alert("Error getting data!");
    console.log(e.title + "\n" + e.messsage);
  }
}
