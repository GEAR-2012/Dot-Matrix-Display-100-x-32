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
used variables in other scripts:
/from 'dispBuild.js'/
dmdWidth => width of the dotmatrix display
dmdHeight => height of the dotmatrix display
dotSize => dot size of the dotmatrix display
dotRad => radius of dot on the dotmatrix display
gap => gap between dots on the dotmatrix display
baseColor => color of unlited dots on the dotmatrix display
mContainer => container for the dotmatrix display

/from 'getData.js'/
bmm => for the brightness matrix map
bmWidth => for the width of the brightness matrix
bmHeight => for the height of the brightness matrix
*/

let ledColArr = ["#ff0000", "#00ff00", "#0000ff", "#ffffff", "#ffff00"]; // container for possible color values
let activeLedCol = 3; // index of the active LED color in the led color array
let litColor = ledColArr[activeLedCol]; // color of lited dots on the dotmatrix display
let speedLowest = 500;
let speedHighest = 80;
let speedArr = [
  speedHighest,
  speedHighest + (speedLowest - speedHighest) / 2,
  speedLowest,
]; // container for possible scrolling speeds
let activeSpeed = 0; // index of the active matrix speed in the speed array
let speed = speedArr[activeSpeed]; // scrolling speed of the matrix (milliseconds)
let glow = true; // glowing dots on the dotmatrix display
let myTimer; // it's the timer to scroll the matrix on the display
let startCounter = dmdWidth; // it will count the first 'n' repeat to scroll in the matrix
let scrollBtn; // its for the scroll / pause button to change the text content
let scrolling = false; // to follow if the scrolling is on or off
//
let upperCrtl = document.querySelector("#link");
let ctrlCont;

document.addEventListener("mousemove", controlsIn);
document.addEventListener("keypress", controlsIn);
document.addEventListener("touchstart", controlsIn);

// after the data received display the scroll button
if (bmm != undefined) {
  bmm = matrixExtender(bmm); // extend the matrix
  bmm = stringToArray(bmm);
  bmm = addStartBlock(bmm);
  buildControls();
}

// add 'empty' data to the matrix for the start
function addStartBlock(arr) {
  arr.forEach(function (row) {
    for (let i = 0; i < startCounter; i++) {
      row.unshift(0);
    }
  });
  return arr;
}

// scrolling
function timerToDo() {
  // if scrolling:
  if (scrolling) {
    // startCounter eating
    --startCounter;
    if (startCounter >= 0) {
      // eating
      bmm.forEach(function (row) {
        row.shift(0);
      });
    } else {
      // shifting
      bmm.forEach(function (row) {
        let f = row.shift();
        row.push(f);
      });
    }
  }
  for (let x = 0; x < dmdWidth; x++) {
    // lit one column:
    for (let y = 0; y < dmdHeight; y++) {
      // make id from coordinates
      let id = `${x}/${y}`;
      let nextPix = document.getElementById(id);

      /*
      check for brightness info and concatenate to the 'litColor'
      */
      const bi = bmm[y][x]; // brightness info (0-Z)
      // convert the brightness info to hexadecimal value (00 - ff)
      const brHex = parseInt((bi * (255 / 35)).toFixed(0), 10)
        .toString(16)
        .padStart(2, "0");
      // check for brightness matrix data
      if (bi > 0) {
        // lit the next dot
        let dotLitCol = litColor + brHex;
        nextPix.style.backgroundColor = dotLitCol;
        // get it glow if required
        if (glow) {
          nextPix.style.boxShadow = `0 0 ${gap * 0.6}px ${
            gap * 0.2
          }px ${dotLitCol}`;
        }
      } else {
        // off the next dot
        nextPix.style.backgroundColor = baseColor;
        // get off glow if required
        if (glow) {
          nextPix.style.boxShadow = "";
        }
      }
    }
  }
}

function startTimer() {
  scrolling = true;
  myTimer = setInterval(timerToDo, speed);
  scrollBtn.removeEventListener("mousedown", startTimer);
  scrollBtn.classList.add("active");
  scrollBtn.addEventListener("mousedown", stopTimer);
  // call the controls out function
}

function stopTimer() {
  scrolling = false;
  clearInterval(myTimer);
  scrollBtn.removeEventListener("mousedown", stopTimer);
  scrollBtn.classList.remove("active");
  scrollBtn.addEventListener("mousedown", startTimer);
}

// extend the matrix
// if the matrix long enough then just add a separator block (eg.: 16 dot x dot)
// if the matrix too short it need to be multiply and add separator block too
function matrixExtender(arr) {
  // check for width
  if (bmWidth >= dmdWidth) {
    // only need separator block (matrix + sepbl)
    arr.forEach(function (item, i) {
      item = item.padEnd(bmWidth + dmdHeight, "0");
      arr[i] = item;
    });
  } else if (bmWidth < dmdWidth) {
    // need multiplication (matrix + sepbl + matrix + sepbl + matrix + sepbl)
    arr.forEach(function (item, i) {
      item = item.padEnd(arr[i].length + dmdHeight, "0");
      arr[i] = item;
    });
    while (arr[0].length + dmdHeight <= dmdWidth) {
      arr.forEach(function (item, i) {
        arr[i] += item;
      });
    }
  }
  return arr;
}

// makes an array from all string elements to a number array
function stringToArray(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    arr[i] = [...arr[i]];
  }
  // parse each element to brightness numbers
  arr.forEach(function (row, y) {
    row.forEach(function (col, x) {
      col = parseInt(col, 36);
      arr[y][x] = col;
    });
  });
  return arr;
}

// build up the control interface
function buildControls() {
  /* ********************   MAIN CONTROL CONTAINER   ******************** */
  let mainWrapper = document.querySelector("#main-wrapper");
  // main container for the control elements
  ctrlCont = document.createElement("div");
  ctrlCont.setAttribute("id", "ctrl-cont");

  /* ********************   SCROLL / STOP BUTTON   ******************** */
  scrollBtn = document.createElement("button");
  scrollBtn.setAttribute("id", "scroll-pause");
  scrollBtn.classList.add("ctrl-btn");
  scrollBtn.innerHTML = "<span><<<</span> Scroll";
  scrollBtn.addEventListener("mousedown", startTimer);
  ctrlCont.appendChild(scrollBtn);

  /* ********************   LED COLOR CONTROL CONTAINER   ******************** */
  let noOfCol = 5;
  let ledColCtrlCont = document.createElement("div");
  ledColCtrlCont.setAttribute("id", "led-col-ctrl-cont");
  // buttons:
  let ledColBtnTxt = ["R", "G", "B", "W", "Y"];
  for (let x = 0; x < noOfCol; x++) {
    let ledColBtn = document.createElement("button");
    ledColBtn.setAttribute("id", `led-col-btn-${x}`);
    ledColBtn.classList.add("ctrl-btn", "led-col");
    ledColBtn.innerHTML = ledColBtnTxt[x];
    ledColBtn.addEventListener("mousedown", ledColChange);
    ledColCtrlCont.appendChild(ledColBtn);
    if (activeLedCol === x) {
      ledColBtn.classList.add("active");
    }
  }
  ctrlCont.appendChild(ledColCtrlCont);

  /* ********************   SPEED CONTROL CONTAINER   ******************** */
  let noOfSpeeds = 3;
  let speedCtrlCont = document.createElement("div");
  speedCtrlCont.setAttribute("id", "speed-ctrl-cont");
  // buttons:
  let speedBtnTxt = ["<<<", "<<", "<"];
  for (let x = 0; x < noOfSpeeds; x++) {
    let speedBtn = document.createElement("button");
    speedBtn.setAttribute("id", `speed-btn-${x}`);
    speedBtn.classList.add("ctrl-btn", "speed");
    speedBtn.innerHTML = `<span>${speedBtnTxt[x]}</span>`;
    speedBtn.addEventListener("mousedown", speedChange);
    speedCtrlCont.appendChild(speedBtn);
    if (activeSpeed === x) {
      speedBtn.classList.add("active");
    }
  }
  ctrlCont.appendChild(speedCtrlCont);

  mainWrapper.appendChild(ctrlCont);
}

// change the color of the LEDs on the display
function ledColChange() {
  // get the id of the pressed button
  id = this.id;

  // set inactive all color button but active the last pressed
  let allColButton = document.querySelectorAll(".led-col");
  allColButton.forEach(function (item) {
    item.classList.remove("active");
  });
  this.classList.add("active");

  // set the color property of the active LEDs
  litColor = ledColArr[id.slice(-1)];

  // if not scrolling, refresh the display
  if (!scrolling) {
    timerToDo();
  }
}

// change the stepping speed of the matrix on the display
function speedChange() {
  // get the id of the pressed button
  id = this.id;
  let itWasScrolling = false;

  // remembering of the display state
  if (scrolling) {
    itWasScrolling = true;
  } else {
    itWasScrolling = false;
  }

  // if scrolling, because will need to restart the timer
  if (itWasScrolling) {
    stopTimer();
  }

  // set inactive all speed button but active the last pressed
  let allSpeedButton = document.querySelectorAll(".speed");
  allSpeedButton.forEach(function (item) {
    item.classList.remove("active");
  });
  this.classList.add("active");

  // set the speed property of the matrix
  speed = speedArr[id.slice(-1)];

  // if scrolling, to reload the new speed value into the timer
  if (itWasScrolling) {
    startTimer();
  }
}

let myTimeout;

// fade the controls out
function controlsOut() {
  upperCrtl.classList.add("fade-out");
  ctrlCont.classList.add("fade-out");
}

// fade the controls in
function controlsIn(e) {
  if (upperCrtl && ctrlCont) {
    clearTimeout(myTimeout);
    upperCrtl.classList.remove("fade-out");
    ctrlCont.classList.remove("fade-out");
    myTimeout = setTimeout(function () {
      controlsOut();
    }, 10000);
  }
}
