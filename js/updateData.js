function insertData(postReq, tableID) {
  var ajax =  new XMLHttpRequest();

  var form = document.getElementById("inputForm");
  var data = new FormData(form);

  ajax.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      loadData(this, tableID);
    }
  }

  ajax.open("POST", postReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajax.send(data_to_string(data));
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
    alert("Error getting data!");
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
