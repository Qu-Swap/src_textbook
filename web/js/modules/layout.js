layout = function() {
  function toggle_element(elementID) {
    var el = $(`#${elementID}`);

    if(el.css("display") == "none" ) {
      el.css("display", "block");
    }
    else {
      el.css("display", "none");
    }
  }

  return {
    toggle_element: toggle_element
  }
}();