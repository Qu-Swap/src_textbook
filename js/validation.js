// Input validation for book details, only if user selects new book
function validate_book_form(bookData) {
  var isbn = bookData.get("isbn");
  var isbnregex = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
  if(!isbnregex.test(isbn)){
    alert("Invalid ISBN");
    return false;
  }

  return true;
}

// Input validation for offer details, general
function validate_offer_form(offerData) {
  var price = offerData.get("price");
  var priceregex = /^\$?[0-9]+\.?[0-9]?[0-9]?$/;
  var personname = offerData.get("name");
  var nameregex = /^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/;
  if(!nameregex.test(personname)){
    alert("Invalid buyer/seller name");
    return false;
  }
  else if(!priceregex.test(price)){
    alert("Invalid price");
    return false;
  }

  return true;
}