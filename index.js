let showSeconds = true;

// which digit style is used (is the index of `availableStyles`)
let currentStyle = 0;

// available styles, see in `digits/`
const availableStyles = ['s-animated', 's-static', 'm-static'];

// the following two consts are used to reduce refresh rate of digits (to optimize performance)
// current time, array of digits, format: ssmmhh
// '' stands for invisible digit
const currentDigits = ['0', '0', '1', '4', '9', '0']
// if the colons are visible. [0]: the one between ss and mm, [1]: the one between mm and hh
const colonsVisible = [true, true];



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

function updateTime(forceUpdate = false) {
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
    // unless forceUpdate is true (update all digits)
    if (!forceUpdate && digitToUpdate === currentDigits[i]) {
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
}


function toggleShowSeconds(isShowSeconds, updateConfig = true) {
  if (isShowSeconds !== undefined) {
    showSeconds = isShowSeconds;
  } else {
    showSeconds = !showSeconds;
  }

  console.log("Show seconds:", showSeconds);

  updateTime();

  if (updateConfig) saveConfig();
}


function toggleChangeStyle(desiredStyle, updateConfig = true) {
  if (desiredStyle !== undefined) {
    currentStyle = desiredStyle;
  } else {
    currentStyle = (currentStyle + 1) % availableStyles.length;
  }

  console.log("Change style:", availableStyles[currentStyle]);

  colonArr[0].src = `digits/${availableStyles[currentStyle]}/colon.gif`;
  colonArr[1].src = `digits/${availableStyles[currentStyle]}/colon.gif`;

  updateTime(true);

  if (updateConfig) saveConfig();
}

async function saveConfig() {
  // wait for all the images to load
  await Promise.all(getImagePromises());

  const config = {
    showSeconds,
    currentStyle,
    right: calculateDigitContainerOffsetRight(),
    top: digitContainer.offsetTop,
  };

  console.log("Saving config:", config);

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
  toggleChangeStyle(currentStyle, false);
  toggleShowSeconds(showSeconds, false);

  // only set position if all images have been loaded
  // otherwise the position will be incorrect 
  // since offsetRight needs to be calculated according to the image size
  await Promise.all(getImagePromises());

  // make sure the clock is inside the viewport
  if (0 < config.right && config.right < vw && 0 < config.top && config.top < vh) {
    digitContainer.style.right = `${config.right}px`;
    digitContainer.style.top = `${config.top}px`;
  }

  toggleChangeStyle(currentStyle, false);
  toggleShowSeconds(showSeconds, false);
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

// repeatedly update the time
const intervalId = setInterval(updateTime, 1000);

// refresh the page every hour to alleviate increasing memory usage
//
// *** this is a temporary fix ***
//
// because I noticed a increasing memory usage (possibly a memory leak) from Plash Web Content, around 100MB/hour
// still not sure if this is a bug or a feature (either of my code, or Plash, or the system webview itself)
// (tested with Plash v2.1.1, macOS 10.15.7, Safari 15.4)
//
// it seems like **chromium-based** browsers are free of this problem from my initial tests
// although I haven't used this webpage with chromium-based browsers for extended periods of time.
// to my knowledge, only webkit-based browsers are affected, i.e. the webview inside Plash
//
// i will upload a proper fix if i can find the cause of this memory problem later
// currently, with this fix, the memory usage of **all** Plash processes is like: highest: 180MB (after 1 hr), lowest: 50MB, which is respectable
// (CPU usage is not affected, always very low. depending on your settings, varies from 0.2% to 2%)
setTimeout(() => {
  window.location.reload();
}, 3600000);