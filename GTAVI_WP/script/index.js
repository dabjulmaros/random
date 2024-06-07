const front = document.querySelector(".front");
const middle = document.querySelector(".middle");

let height = window.innerHeight;
let width = window.innerWidth;
let maxTranslate = width > height ? width / 100 : height / 100;

let animate = true;

let oldDay, oldDate, oldTime;

const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
const dateOptions = { month: "short", year: "numeric", day: "2-digit" };
const dayOptions = { weekday: "long" };

function setDate() {
  const date = new Date();

  const newTime = date.toLocaleDateString(undefined, timeOptions).split(",")[1];
  const newDate = date.toLocaleDateString(undefined, dateOptions);
  const newDay = date.toLocaleDateString(undefined, dayOptions);

  if (newTime !== oldTime) {
    document.querySelector(".time").innerText = newTime;
    oldTime = newTime;
  }
  if (newDate !== oldDate) {
    document.querySelector(".date").innerText = newDate;
    oldDate = newDate;
  }
  if (newDay !== oldDay) {
    document.querySelector(".weekDay").innerText = newDay;
    oldDay = newDay;
  }
}

setInterval(() => setDate(), 30 * 1000);
setDate();

document.querySelector("input").addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    chrome.search
      .query({ text: document.querySelector("input").value })
      .then((e) => console.log(e));
  }
});

//capture mouse movent for parallax
document.body.addEventListener("mousemove", (e) => {
  //code block used to handle smooth mouse recapture
  if (front.style.transition !== "") {
    return;
  }
  if (!animate) {
    front.style.transition = "translate .1s ease-in-out";
    middle.style.transition = "translate .1s ease-in-out";
    setTimeout(() => {
      animate = true;
      front.style.transition = "";
      middle.style.transition = "";
    }, 110);
  }

  const mouseX = (e.clientX - width / 2) / width;
  const mouseY = (e.clientY - height / 2) / height;

  front.style.translate = `${mouseX * maxTranslate}px ${
    mouseY * maxTranslate
  }px`;
  middle.style.translate = `${mouseX * maxTranslate * 0.3}px ${
    mouseY * maxTranslate * 0.5
  }px`;
});

//resets size values after resize
document.body.addEventListener("resize", () => {
  height = window.innerHeight;
  width = window.innerWidth;
  maxTranslate = width > height ? width / 100 : height / 100;
});

///Handles mouse movement recapture
document.onmouseleave = () => {
  document.onmouseenter = mouseEnter;
};

function mouseEnter() {
  animate = false;
  document.removeEventListener("mouseenter", mouseEnter);
}
