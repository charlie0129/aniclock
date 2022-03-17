let showSeconds = true;

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

// make the clock div draggable
// https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

function toggleShowSeconds() {
    showSeconds = !showSeconds;
    if (!showSeconds) {
        elementArr[0].className = 'digit-hidden';
        elementArr[1].className = 'digit-hidden';
        colonArr[0].className = 'digit-hidden';
    } else {
        elementArr[0].className = 'digit';
        elementArr[1].className = 'digit';
        colonArr[0].className = 'digit';
    }
}

function startTick() {
    const timeString = (new Date()).toLocaleTimeString();
    // truncate time string to only show hours, minutes, and seconds
    const timeStringTruncated = timeString.substring(0, timeString.lastIndexOf(':') + 3);
    // remove colon from time string
    const timeStringNoColon = timeStringTruncated.replaceAll(':', '');
    // reverse it to match our digit order
    const timeStringReversed = timeStringNoColon.split('').reverse().join('');

    for (let i = 0; i < 6; i++) {
        // skip seconds if not showing seconds
        if (!showSeconds && i < 3) {
            continue;
        }

        const currentDigit = timeStringReversed[i];
        if (currentDigit === undefined) {
            elementArr[i].className = 'digit-hidden';
        } else {
            elementArr[i].className = 'digit';
            elementArr[i].src = `digits/${currentDigit}.gif`;
        }

    }

    setTimeout(startTick, 1000);
}