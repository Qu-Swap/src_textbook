function removeData(deleteReq, tableID, rownum) {
  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      loadData(this, tableID);
    }
  }

  ajax.open("POST", deleteReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  ajax.send("rowid="+(rownum).toString());
}

function deleteData(deleteReq, tableID, rownum) {
  try {
    removeData(deleteReq, tableID, rownum);
  }
  catch(e) {
    alert("Error getting data!");
    console.log(e.title + "\n" + e.messsage);
  }
}
