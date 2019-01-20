function removeData(deleteReq, tableID, id, password, complete, succ, fail) {
  console.log(complete);
  var ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function() {
    if(this.readyState == 4) {
      if(this.status == 200) {
        if (!this.responseText) {
          display_message(MESSAGES.PASS, true);
		  fail();
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
		  succ();
        }
      }
      else if(this.status == 269) {
        display_message(MESSAGES.ERR);
		fail();
        updateData("refresh");
      }
    }
  }

  ajax.open("POST", deleteReq, true);
  ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  ajax.send(`id=${id}&password=${remove_special(password)}&success=${complete}`);
}

function deleteData(id, form, complete) {
  var req = (state === STATES.SELL) ? "deleteSellData" : "deleteBuyData";
  var tableID = (state === STATES.SELL) ? "sellTable" : "buyTable";
  var password = form.password.value;
  try {
    removeData(req, tableID, id, password, complete,
		function () {$(form).remove(); display_message(MESSAGES.DELETE, true);},
		function() {form.reset()});
  }
  catch(e) {
	console.log(e);
    display_message(MESSAGES.ERR);
  }
}
function closePrompt(el) {
	// The "element" is actually the remove button not the form, so let's delete its parent instead.
	$(el).parent().remove();
}

// Ask the user whether their transaction was successful
function successPrompt(id, el) {
  $('.success-prompt').remove();
  $('.password-prompt').remove();

  var container = (state === STATES.SELL) ? "#sellingOffers" : "#buyingOffers";

  var form = $(document.createElement("form"));
	form.submit(function() {$(this).remove(); passPrompt(id, el, $(this).attr('action')); return false;});
	form.addClass('success-prompt');

	form.html(`<p class='box'>Was your transaction successful?</p> \
			   <button type='button' onclick='closePrompt(this)' class='btn close-corner'><i class='fas fa-times'></i></button>\
         <div class='box'>\
			   <button type='submit' onclick="this.form.action='yes'" class='btn' style='margin-right: 2.5%'>Yes</button>\
         <button type='submit' onclick="this.form.action='no'" class='btn'>No</button></div>`)

	$(container).append(form);
	var pos = $(el).offset();
	pos.left -= form.width()
	form.offset(pos);

	form.find("input").focus();
}

function passPrompt(id, el, action) {
  var complete = action === "yes" ? 1 : 0;

	// Let's only have one prompt open at a time
	$('.password-prompt').remove();
  $('.success-prompt').remove();

	var container = (state === STATES.SELL) ? "#sellingOffers" : "#buyingOffers";

	var form = $(document.createElement("form"));
	form.submit(function() { deleteData(id, this, complete); return false;});
	form.addClass('password-prompt');

	form.html("<input name='password' type='password' class='form-control' placeholder='Password' required> \
			   <button type='button' onclick='closePrompt(this)' class='btn'><i class='fas fa-times'></i></button>\
			   <button type='submit' class='btn'><i class='fas fa-check'></i></button>")

	$(container).append(form);
	var pos = $(el).offset();
	pos.left -= form.width()
	form.offset(pos);

	// Focus the password input
	form.find("input").focus();
}