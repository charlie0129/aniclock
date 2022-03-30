let showSeconds = true;
// which digit style is used (is the index of `availableStyles`)
let currentStyle = 0;

// available styles, see in `digits/`
const availableStyles = ['s-animated', 's-static', 'm-static'];

const digitContainer = document.getElementById("digit-container");

const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

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

function startTick(loop) {
  const timeString = (new Date()).toLocaleTimeString();
  // truncate time string to only show hours, minutes, and seconds
  const timeStringTruncated = timeString.substring(0, timeString.lastIndexOf(':') + 3);
  // remove colon from time string and reverse it to match our digit order
  const timeStringNoColonReversed = timeStringTruncated.replaceAll(':', '').split('').reverse();

  if (!showSeconds) {
    timeStringNoColonReversed[0] = undefined;
    timeStringNoColonReversed[1] = undefined;
    colonArr[0].className = 'digit-hidden';
  } else {
    colonArr[0].className = 'digit';
  }

  for (let i = 0; i < 6; i++) {

    const currentDigit = timeStringNoColonReversed[i];
    if (currentDigit === undefined) {
      elementArr[i].className = 'digit-hidden';
    } else {
      elementArr[i].className = 'digit';
      elementArr[i].src = `digits/${availableStyles[currentStyle]}/${currentDigit}.gif`;
    }
  }

  if (loop) {
    setTimeout(() => { startTick(loop) }, 1000);
  }
}

function toggleShowSeconds(isShowSeconds, updateConfig = true) {
  if (isShowSeconds !== undefined) {
    showSeconds = isShowSeconds;
  } else {
    showSeconds = !showSeconds;
  }

  startTick(false);
  if (updateConfig) saveConfig();
}

function toggleChangeStyle(desiredStyle, updateConfig = true) {
  if (desiredStyle !== undefined) {
    currentStyle = desiredStyle;
  } else {
    currentStyle = (currentStyle + 1) % availableStyles.length;
  }

  colonArr[0].src = `digits/${availableStyles[currentStyle]}/colon.gif`;
  colonArr[1].src = `digits/${availableStyles[currentStyle]}/colon.gif`;

  startTick(false);
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

function loadConfig() {
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
  Promise.all(getImagePromises()).then(() => {
    // make sure the clock is inside the viewport
    if (0 < config.left && config.left < vw && 0 < config.top && config.top < vh) {
      digitContainer.style.right = `${calculateDigitContainerOffsetRight(config.left)}px`;
      digitContainer.style.top = `${config.top}px`;
    }

    toggleChangeStyle(currentStyle, false);
    toggleShowSeconds(showSeconds, false);
  });
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
