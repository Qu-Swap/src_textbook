request = function() {
  function init_req(callback) {
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {
      if(this.readyState === 4 && this.status === 200) {
        callback(JSON.parse(this.responseText));
      }
    };

    return ajax;
  }

  function get(request, callback) {
    var ajax = init_req(callback);

    ajax.open("GET", request, true);
    ajax.send();
  }

  function post(request, data, callback) {
    var ajax = init_req(callback);

    ajax.open("POST", request, true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send(data);
  }

  return {
    get: get,
    post: post
  }
}();