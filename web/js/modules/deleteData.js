deleteDataModule = function() {
  function removeData(deleteReq, tableID, id, password, complete, succ, fail) {
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
      if(this.readyState == 4) {
        if(this.status == 200) {
          if (!this.responseText) {
            display_message(msgBox, msgText, MESSAGES.PASS);
  		      fail();
          }
          else {
            var data = JSON.parse(this.responseText);
            if(tableID === "buyTable") {
              getDataModule.buyData = data;
            }
            else {
              getDataModule.sellData = data;
            }

            getDataModule.loadTableData(tableID);
  		      succ();
          }
        }
        else if(this.status == 269) {
          display_message(msgBox, msgText, MESSAGES.ERR);
  		    fail();
          updateDataModule.updateData("refresh");
        }
      }
    }

    ajax.open("POST", deleteReq, true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    ajax.send(`id=${id}&password=${updateDataModule.remove_special(password)}&success=${complete}`);
  }

  function deleteData(id, form, complete) {
    var req = (state === STATES.SELL) ? "deleteSellData" : "deleteBuyData";
    var tableID = (state === STATES.SELL) ? "sellTable" : "buyTable";
    var password = form.password.value;
    try {
      removeData(req, tableID, id, password, complete,
  		function () {$(form).remove(); display_message(msgBox, msgText, MESSAGES.DELETE, true);},
  		function() {form.reset()});
    }
    catch(e) {
  	console.log(e);
      display_message(msgBox, msgText, MESSAGES.ERR);
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

  	form.html(`<p>Was your transaction successful?</p>
  			   <button type='button' onclick='deleteDataModule.closePrompt(this)' class='btn close-corner'><i class='fas fa-times'></i></button>
  			   <div class='btns'>
  					<button type='submit' onclick="this.form.action='yes'" class='btn'>Yes</button>
  					<button type='submit' onclick="this.form.action='no'" class='btn'>No</button>
  			   </div>`)

  	$(container).append(form);
  	var pos = $(el).offset();
  	pos.left -= form.width()
  	form.offset(pos);
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
  			   <button type='button' onclick='deleteDataModule.closePrompt(this)' class='btn'><i class='fas fa-times'></i></button>\
  			   <button type='submit' class='btn'><i class='fas fa-check'></i></button>")

  	$(container).append(form);
  	var pos = $(el).offset();
  	pos.left -= form.width()
  	form.offset(pos);

  	// Focus the password input
  	form.find("input").focus();
  }

  return {
    removeData: removeData,
    deleteData: deleteData,
    closePrompt: closePrompt,
    successPrompt: successPrompt,
    passPrompt: passPrompt
  }
}();