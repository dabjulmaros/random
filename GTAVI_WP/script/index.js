const front = document.querySelector(".front");
const middle = document.querySelector(".middle");
const back = document.querySelector(".back");

let height = window.innerHeight;
let width = window.innerWidth;
let maxTranslate = width > height ? width / 100 : height / 100;

let animate = true;

let oldDay, oldDate, oldTime;

let random = true;
const allowed = ["bt", "dr", "oc", "oh", "pr", "sc"];

const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
const dateOptions = { month: "short", year: "numeric", day: "2-digit" };
const dayOptions = { weekday: "long" };

let searchParams = new URLSearchParams(location.search);
if (searchParams.has('style')) {
  const style = searchParams.get('style');
  if (allowed.includes(style)) {
    setStyle(style);
  }
};

if (random) {
  if (Math.random(Math.random()) > .3)
    setStyle(allowed[Math.floor(Math.random() * allowed.length)])
}

function setStyle(style) {
  const bgImage = new Image();
  bgImage.src = `./assets/others/${style}_Hero_BG.webp`;
  const fgImage = new Image();
  fgImage.src = `./assets/others/${style}_Hero_FG.webp`;

  let bgLoad = false;
  let fgLoad = false;

  bgImage.onload = () => {
    bgLoad = true;
    setImage()
  }
  fgImage.onload = () => {
    fgLoad = true;
    setImage()
  }

  function setImage() {
    if (bgLoad && fgLoad) {
      middle.src = bgImage.src
      front.src = fgImage.src
      // back.src = "";
      // back.style.display = "none";

      if (style !== "dr") {
        front.style.width = "initial";
        front.style.overflow = "visible";
        front.style.top = "initial";
        front.style.left = "initial";
        front.style.right = "-5vw";
        front.style.bottom = "-5vh";
      }

      switch (style) {
        case "oc":
          front.style.right = "-6vw";
          break;
        case "oh":
          front.style.right = "5vw";
          break;
        case "pr":
          front.style.left = "0vw";
          front.style.right = "initial";
          break;
        case "sc":
          front.style.right = "-5vw";
          break;
      }
    }
  }

}

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

if (chrome.search != undefined) {
  document.querySelector("input").addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      chrome.search
        .query({ text: document.querySelector("input").value })
        .then((e) => console.log(e));
    }
  });
} else {
  document.querySelector(".search").style.display = 'none';
}



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

  front.style.translate = `${mouseX * maxTranslate}px ${mouseY * maxTranslate
    }px`;
  middle.style.translate = `${mouseX * maxTranslate * 0.3}px ${mouseY * maxTranslate * 0.5
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
