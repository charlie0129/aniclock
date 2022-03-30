let showSeconds = true;
// which digit style is used (is the index of `availableStyles`)
let currentStyle = 0;

// the following two consts are used to reduce refresh rate of digits
// current time, array of digits, format: ssmmhh
// '' stands for invisible digit
const currentDigits = ['0', '0', '1', '4', '9', '0']
// if the colons are visible. [0]: the one between ss and mm, [1]: the one between mm and hh
const colonsVisible = [true, true];

// available styles, see in `digits/`
const availableStyles = ['s-animated', 's-static', 'm-static'];


const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)


const digitContainer = document.getElementById("digit-container");

// calculate the offset right from offset left of the digit container
function calculateDigitContainerOffsetRight(left) {
  if (left === undefined) {
    return vw - digitContainer.offsetLeft - digitContainer.offsetWidth;
  }

  return vw - left - digitContainer.offsetWidth;
}


// get digit images from document
const elementArr = [];
for (let i = 0; i < 6; i++) {
  elementArr.push(document.getElementById(`digit-${i}`));
}

// get colons from document
const colonArr = [
  document.getElementById('colon-0'),
  document.getElementById('colon-1'),
];

// promises that are resolved if the images (digits) are loaded
// this is used to know when they are loaded to ensure that
// the size of the digit container is calculated correctly
// (since unloaded images have 0 width)
function getImagePromises() {
  const imagePromises = [];
  const images = [...elementArr, ...colonArr];
  images.forEach((e) => {
    if (!e.complete) {
      imagePromises.push(new Promise((resolve) => {
        e.onload = resolve;
      }));
    }
  });
  return imagePromises;
}

async function startTick(loop) {
  const timeString = (new Date()).toLocaleTimeString();
  // truncate time string to only show hours, minutes, and seconds
  const timeStringTruncated = timeString.substring(0, timeString.lastIndexOf(':') + 3);
  // remove colon from time string and reverse it to match our digit order: ssmmhh
  // stored as array of strings so that we can easily change a single digit
  const timeStringNoColonReversed = timeStringTruncated.replaceAll(':', '').split('').reverse();
  // set the last digit to an empty string if the hour is a single digit, e.g. [x]9:14:12, stored as 21419[]
  if (!timeStringNoColonReversed[5]) {
    timeStringNoColonReversed[5] = '';
  }

  if (!showSeconds) {
    timeStringNoColonReversed[0] = '';
    timeStringNoColonReversed[1] = '';
  }

  // do not update dom if colon visibility has not changed
  if (showSeconds !== colonsVisible[0]) {
    colonArr[0].className = showSeconds ? 'digit' : 'digit-hidden';
    colonsVisible[0] = showSeconds;
  }


  for (let i = 0; i < 6; i++) {
    const digitToUpdate = timeStringNoColonReversed[i];

    // do not update dom if this digit has not changed (including value and visibility)
    // unless loop is false (indicating that this is the first tick, needs force update)
    if (loop && digitToUpdate === currentDigits[i]) {
      continue;
    }

    if (digitToUpdate) {
      elementArr[i].className = 'digit';
      elementArr[i].src = `digits/${availableStyles[currentStyle]}/${digitToUpdate}.gif`;
    } else {
      elementArr[i].className = 'digit-hidden';
    }

    currentDigits[i] = digitToUpdate;
  }

  if (loop) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    startTick(true);
  }
}


async function toggleShowSeconds(isShowSeconds, updateConfig = true) {
  if (isShowSeconds !== undefined) {
    showSeconds = isShowSeconds;
  } else {
    showSeconds = !showSeconds;
  }

  console.log("Show seconds:", showSeconds);

  await startTick(false);
  if (updateConfig) saveConfig();
}


async function toggleChangeStyle(desiredStyle, updateConfig = true) {
  if (desiredStyle !== undefined) {
    currentStyle = desiredStyle;
  } else {
    currentStyle = (currentStyle + 1) % availableStyles.length;
  }

  console.log("Change style:", availableStyles[currentStyle]);

  colonArr[0].src = `digits/${availableStyles[currentStyle]}/colon.gif`;
  colonArr[1].src = `digits/${availableStyles[currentStyle]}/colon.gif`;

  await startTick(false);
  if (updateConfig) saveConfig();
}

async function saveConfig() {
  await Promise.all(getImagePromises());

  const config = {
    showSeconds,
    currentStyle,
    left: digitContainer.offsetLeft,
    top: digitContainer.offsetTop,
  };

  localStorage.setItem('config', JSON.stringify(config));
}

async function loadConfig() {
  const configStr = localStorage.getItem('config');

  if (!configStr) {
    return;
  }

  const config = JSON.parse(configStr);
  console.log("Loaded config:", config);
  showSeconds = config.showSeconds ?? true;
  currentStyle = config.currentStyle ?? 0;

  // set once first to avoid initial style being unequal to actual style
  await toggleChangeStyle(currentStyle, false);
  await toggleShowSeconds(showSeconds, false);

  // only set position if all images have been loaded
  // otherwise the position will be incorrect 
  // since offsetRight needs to be calculated according to the image size
  await Promise.all(getImagePromises());

  // make sure the clock is inside the viewport
  if (0 < config.left && config.left < vw && 0 < config.top && config.top < vh) {
    digitContainer.style.right = `${calculateDigitContainerOffsetRight(config.left)}px`;
    digitContainer.style.top = `${config.top}px`;
  }

  await toggleChangeStyle(currentStyle, false);
  await toggleShowSeconds(showSeconds, false);
}

// make the clock div draggable
// from https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id)) {
    // if present, the header is where you move the div from
    document.getElementById(elmnt.id).onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the div
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.right = (calculateDigitContainerOffsetRight() + pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
    saveConfig();
  }
}

dragElement(digitContainer);
loadConfig();
startTick(true);
