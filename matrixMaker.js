/*
This script generates a brightness matrix map from an alpha channel of an image.

  - It takes a user-selected image and copies it into the browser window and magnifies it by the specified parameter.
  - After that, it creates a canvas with the width of the selected image and the height of the specified parameter & also magnify it by the specified parameter.
  - Then it takes a sample from the image with the width of the selected image and the height of the specified parameter & copies it into the middle of the canvas. If the image is higher than the specified parameter, the sample will be cropped from the center of the image. Thus, the sample will be as high as the specified parameter.
  - It then scans the pattern pixel by pixel and converts the pixel alpha channel information so that a digit can store the information. It concatenates the resulting characters from each line into a string one line at a time and then pushes them into an array. Then, when it is finished with the complete sample,  it stores the information has received in the localStorage, thus the information can recall later on.
  - Then the script displays the taken information for the user to check it.
  - Finally, it creates a link back to the main page.
*/
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

user variables
*/
let dmdHeight = 32; // height of the dotmatrix display
let magnify = 5;
/*

program variables
*/
let sampleWidth;
let sampleHeight;
let container = document.querySelector("#result");
let imgTag;
let ctx;
let brightnessArray;

/*
after the content loaded into the browser,
add an event listener to the file selector element
*/
window.onload = function () {
  if (document.getElementById("getimage")) {
    var y = document.getElementById("getimage");
    y.addEventListener("change", loadimage, false);
  }
};

/*
File selector event handler.
Once it's loaded it calls the image handler
*/
function loadimage(e1) {
  var filename = e1.target.files[0];
  var fr = new FileReader();
  fr.readAsDataURL(filename);
  fr.onload = makeSampleImage;
}

function makeSampleImage(e2) {
  container.innerHTML = "";
  let titleTag = document.createElement("p");
  titleTag.textContent = "Image to use:";
  imgTag = document.createElement("img");
  imgTag.setAttribute("id", "sample-image");
  imgTag.setAttribute("src", e2.target.result);
  imgTag.setAttribute("alt", "sample image");
  imgTag.style.backgroundColor = `red`;
  container.appendChild(titleTag);
  container.appendChild(imgTag);
  imgTag.onload = setImage;
}

function setImage() {
  sampleWidth = imgTag.naturalWidth;
  sampleHeight = imgTag.naturalHeight;
  // sampleHeight = dmdHeight;

  imgTag.style.width = `${sampleWidth * magnify}px`;
  imgTag.style.height = `${sampleHeight * magnify}px`;

  makeCanvas(sampleWidth, dmdHeight);
}

function makeCanvas(w, h) {
  let titleTag = document.createElement("p");
  titleTag.textContent = "Canvas:";
  let canvasTag = document.createElement("canvas");
  canvasTag.setAttribute("id", "canvas");
  canvasTag.width = w;
  canvasTag.height = h;
  canvasTag.style.width = `${w * magnify}px`;
  canvasTag.style.height = `${h * magnify}px`;
  canvasTag.style.backgroundColor = `green`;
  canvasTag.textContent = "Your browser does not support the HTML5 canvas tag.";
  container.appendChild(titleTag);
  container.appendChild(canvasTag);
  copyImageIntoCanvas();
}

function copyImageIntoCanvas() {
  let canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  let img = document.querySelector("#sample-image");
  ctx.drawImage(img, 0, (dmdHeight - sampleHeight) / 2);

  brightnessArray = makeBrightnessMatrix(sampleWidth, dmdHeight);
  displayMatrix(brightnessArray);
}

function makeBrightnessMatrix(w, h) {
  let imgArr = [];
  for (let y = 0; y < h; y++) {
    let oneRow = "";
    for (let x = 0; x < w; x++) {
      // takes one pixel at the time
      let pxData = ctx.getImageData(x, y, 1, 1);
      let op = pxData.data[3]; // opacity of the pixel
      // converts the opacity value (0-255) to one digit info (0-Z);
      oneRow += parseInt((op / (255 / 35)).toFixed(0), 10).toString(36);
    }
    imgArr.push(oneRow);
  }
  /*
  Store in the 'localStorage' the brightness matrix map as a string array.
  It will exist there as a key value pair.
  Key: 'bms' (brightness matrix string), value: imgArr.
   */
  localStorage.setItem("bms", imgArr);
  return imgArr;
}

function displayMatrix(arr) {
  let titleTag = document.createElement("p");
  titleTag.textContent = "Brightness Matrix map:";
  let cont = document.createElement("div");
  cont.classList.add("matrix-display");
  cont.style.fontSize = "6.7px";
  cont.style.letterSpacing = "1px";
  cont.style.lineHeight = "5px";
  let len = arr.length;
  for (let r = 0; r < len; r++) {
    let pTag = document.createElement("p");
    pTag.textContent = arr[r];
    cont.appendChild(pTag);
    container.appendChild(titleTag);
    container.appendChild(cont);
  }
  makeLinkBack();
}

function makeLinkBack() {
  let anchorTag = document.createElement("a");
  anchorTag.href = "index.html";
  anchorTag.textContent = "<<< back";
  container.appendChild(anchorTag);
}
