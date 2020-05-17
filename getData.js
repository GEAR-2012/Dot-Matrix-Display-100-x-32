/*
╔═════════════════════════════════════════════════╗
║                                                 ║
║      Copyright (c)2020 GEAR web developmen      ║
║              sandor.tudja@gmail.com             ║
║                    17-05-2020                   ║
║                                                 ║
╚═════════════════════════════════════════════════╝
*/

/*
Get the brightness matrix map from the 'localStorage' as a string
*/

// set up the scene
let outPut = document.querySelector("#output");
outPut.textContent = "matrix is empty";

// pull the matrix string from the local storage
// Each matrix line data separated with coma
let bms = localStorage.getItem("bms"); // brightness matrix string
// split the lines into an array, it will be the 'Brightness Matrix Map'
let bmm; // for the brightness matrix map
let bmWidth; // for the width of the brightness matrix
let bmHeight; // for the height of the brightness matrix

if (bms) {
  bmm = bms.split(",");

  // get the new size of the matrix
  bmWidth = bmm[0].length;
  bmHeight = bmm.length;

  // ...and display it for checking
  outPut.textContent = `data received, matrix size: ${bmWidth} x ${bmHeight}`;

  // remove the string from the 'localStorage'
  localStorage.removeItem("bms");
}
