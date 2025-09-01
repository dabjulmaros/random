const holder = document.getElementById('holder');
const popout = document.getElementById("popout");

document.getElementById("button").addEventListener("click", (e) => {
  createInviteFile()
})

if (location.href.includes("popout")) {
  popout.remove();
  document.title = "College Closed Generator"
} else {
  popout.addEventListener("click", (e) => {
    window.open(location.href + "#popout", "", 'popup,menubar=no,location=no,toolbar=no,noopener=no,noreferrer=no,resizable=no,width=350,height=350')
  })
}


const header = `BEGIN:VCALENDAR
METHOD:REQUEST
PRODID:MYSELF
VERSION:2.0
`;
const footer = `END:VCALENDAR`;

function AddInput() {
  const input = document.createElement('input');
  input.type = 'date';
  input.addEventListener('change', e => checkLast());
  holder.appendChild(input)
  console.log('added')
}
function checkLast() {
  console.log('checking')
  const eles = holder.querySelectorAll("input");
  if (eles[eles.length - 1].value != "") {
    AddInput();
    holder.scrollTo(0, holder.scrollHeight);
  }
}
AddInput()


const eventBody = (ClosedDay) => {
  const date = new Date(ClosedDay);
  const dateStamp = getStamp(date);
  const endDate = new Date(ClosedDay);
  endDate.setDate(endDate.getDate() + 1);
  const endDateStamp = getStamp(endDate);
  return `BEGIN:VEVENT  
DESCRIPTION;LANGUAGE=en-US:
UID:${"collegeclosed" + create_UUID() + dateStamp}
SUMMARY;LANGUAGE=en-US:College Closed
DTSTART;VALUE=DATE:${dateStamp}
DTEND;VALUE=DATE:${endDateStamp}
CLASS:PRIVATE
PRIORITY:5
DTSTAMP:${new Date().toISOString()}
TRANSP:OPAQUE
STATUS:CONFIRMED
SEQUENCE:0
LOCATION;LANGUAGE=en-US:
X-MICROSOFT-CDO-APPT-SEQUENCE:0
X-MICROSOFT-CDO-OWNERAPPTID:2123949097
X-MICROSOFT-CDO-BUSYSTATUS:OOF
X-MICROSOFT-CDO-INTENDEDSTATUS:OOF
X-MICROSOFT-CDO-ALLDAYEVENT:TRUE
X-MICROSOFT-CDO-IMPORTANCE:1
X-MICROSOFT-CDO-INSTTYPE:0
X-MICROSOFT-DONOTFORWARDMEETING:TRUE
X-MICROSOFT-DISALLOW-COUNTER:FALSE
X-MICROSOFT-REQUESTEDATTENDANCEMODE:DEFAULT
X-MICROSOFT-ISRESPONSEREQUESTED:FALSE
X-MICROSOFT-LOCATIONS:[]
BEGIN:VALARM
DESCRIPTION:REMINDER
TRIGGER;RELATED=START:-PT7H
ACTION:DISPLAY
END:VALARM
END:VEVENT
`;
}

function getStamp(date) {
  return `${date.getUTCFullYear()}${date.getUTCMonth() < 9 ? "0" + (date.getUTCMonth() + 1) : date.getUTCMonth() + 1}${date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate()}`
}

//https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
// Define a function named create_UUID that generates a version 4 UUID.
function create_UUID() {
  // Get the current time in milliseconds since the Unix epoch.
  var dt = new Date().getTime();
  // Replace the placeholders in the UUID template with random hexadecimal characters.
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // Generate a random hexadecimal digit.
    var r = (dt + Math.random() * 16) % 16 | 0;
    // Update dt to simulate passage of time for the next random character.
    dt = Math.floor(dt / 16);
    // Replace 'x' with a random digit and 'y' with a specific digit (4 for UUID version 4).
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  // Return the generated UUID.
  return uuid;
}

function createInviteFile() {

  let icsFile = header;

  for (const date of holder.querySelectorAll("input")) {
    if (date.value != "")
      icsFile += eventBody(date.value);
  }
  icsFile += footer;

  let blob = new Blob([icsFile], { type: "text/calendar;charset=utf-8;" });
  // Edge blob
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  }
  // Rest of browsers
  else {
    let link = document.createElement("a");
    //HTML5 download
    if (link.download !== undefined) {
      let url = URL.createObjectURL(blob);
      //I hate jquery's attr fuction
      link.setAttribute("href", url);
      link.setAttribute("download", "closedDates.ics");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}