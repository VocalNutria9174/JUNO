function AlphabetSoup(str) {
  // code goes here
  var str_array = str.split("");
  str_array = str_array.sort();
  str = str_array.join("");
  return str;
}

// keep this function call here
// to see how to enter arguments in JavaScript scroll down
AlphabetSoup(readline());