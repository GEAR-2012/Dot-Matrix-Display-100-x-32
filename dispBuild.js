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
USER VARIABLES
*/

let dmdWidth = 100; // width of the dotmatrix display
let dmdHeight = 32; // height of the dotmatrix display
//
let windowInner = window.innerWidth;
let dotSizeCalc = (0.99 * windowInner) / (1.1 * dmdWidth - 0.1);

//
// let dotSize = 11.5; // dot size of the dotmatrix display
let dotSize = dotSizeCalc;
let dotRad = dotSize / 2; // radius of dot on the dotmatrix display
let gap = dotSize / 10; // gap between dots on the dotmatrix display
let baseColor = "#000000ff"; // color of unlited dots on the dotmatrix display

//
let mContainer = document.querySelector(".matrix-container"); // container for the dotmatrix display

matrixBuilder(dmdWidth, dmdHeight);

// let's build the matrix
function matrixBuilder(width, height) {
  // catch & format the matrix container
  mContainer.style.display = "grid";
  mContainer.style.gridTemplateColumns = `repeat(${dmdWidth}, auto)`;
  mContainer.style.gridTemplateRows = `repeat(${dmdHeight}, auto)`;
  mContainer.style.gap = `${gap}px`;
  mContainer.style.justifyContent = "start";

  // generates 'dot' elements into the matrix
  for (let y = 0; y < dmdHeight; y++) {
    for (let x = 0; x < dmdWidth; x++) {
      let dot = document.createElement("div");
      dot.style.width = `${dotSize}px`;
      dot.style.height = `${dotSize}px`;
      dot.style.borderRadius = `${dotRad}px`;
      dot.style.backgroundColor = baseColor;
      dot.classList.add("dot");
      dot.setAttribute("id", `${x}/${y}`);

      mContainer.appendChild(dot);
    }
  }
}
alert("Welcome");
