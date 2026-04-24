const popout = document.getElementById("popout");
if (location.href.includes("popout")) {
  popout.remove();
  document.querySelector(".popoutHolder").classList.add("popped");
} else {
  popout.addEventListener("click", (e) => {
    window.open(
      location.href + "#popout",
      "",
      "popup,menubar=no,location=no,toolbar=no,noopener=no,noreferrer=no,resizable=no,width=550,height=650",
    );
    window.close();
  });
}

const wrapper = document.getElementById("wrapper");
const toast = document.getElementById("toast");
let tabs = {};

let debounceLoadTimer;
let countDebounce = 0;
let countLoad = 0;

let debounce;
const search = document.querySelector("input");
const filterIcon = document.querySelector(".filter");

filterIcon.addEventListener("click", (e) => {
  search.value = "";
  filterTabs();
});
search.addEventListener("input", (e) => {
  clearTimeout(debounce);
  debounce = setTimeout(filterTabs, 300);
});

document.querySelector("#reload").onclick = () => {
  loadTabs();
};

function showToast(text = "") {
  if (text == "") return;
  toast.classList.add("show");
  toast.innerText = text;
  setTimeout(() => toast.classList.remove("show"), 2900);
}

async function loadTabs() {
  countLoad++;
  let _tabs = {};
  try {
    _tabs = await chrome.tabs.query({});
  } catch (e) {
    console.error(e);
    showToast("Error Fetching Tabs");
    return;
  }
  tabs = {};
  for (let t of _tabs) {
    // console.log(t);
    if (tabs[t.windowId]) {
      tabs[t.windowId].push(t);
    } else {
      tabs[t.windowId] = [t];
    }
  }
  document.title = `${_tabs.length} Tabs`;
  filterTabs();
}

function filterTabs() {
  const input = search.value.toLowerCase();
  // let filter = JSON.parse(JSON.stringify(tabs));
  if (input != "") {
    filterIcon.classList.add("off");
    const filtered = {};

    for (const w in tabs) {
      if (input == "!isplaying") {
        filtered[w] = tabs[w].filter((t) => t.audible || t.mutedInfo.muted);
      } else {
        filtered[w] = tabs[w].filter(
          (t) =>
            t.title?.toLowerCase().includes(input) ||
            t.url?.toLowerCase().includes(input),
        );
      }
    }

    showTabs(filtered);
  } else {
    filterIcon.classList.remove("off");
    showTabs(tabs);
  }
}

function showTabs(_tabs = tabs) {
  wrapper.innerHTML = "";
  for (const w in _tabs) {
    const span = document.createElement("span");
    span.classList.add("windowGroup");
    for (const t of _tabs[w]) {
      // console.log(t);
      const holderDiv = document.createElement("div");
      holderDiv.classList.add("tabElement");

      // span audible/ muted
      const audioWrapper = document.createElement("span");
      audioWrapper.classList.add("audioWrapper");
      const audio = document.createElement("span");
      audio.classList.add("audio");
      if (t.audible || t.mutedInfo.muted) {
        if (t.mutedInfo.muted) {
          audio.classList.add("mute");
        } else {
          audio.classList.add("speaker");
        }
        audio.classList.add("point");
        const muted = !t.mutedInfo.muted;
        audio.addEventListener("click", async (e) => {
          e.stopPropagation();
          try {
            if (muted) {
              audio.classList.add("mute");
              audio.classList.remove("speaker");
            } else {
              audio.classList.add("speaker");
              audio.classList.remove("mute");
            }
            await chrome.tabs.update(t.id, { muted });
          } catch (e) {
            console.error(e);
            showToast("Unable to mute page");
          }
        });
      }
      // icon
      const icon = document.createElement("img");
      const iconFallback = document.createElement("span");
      iconFallback.classList.add("iconFallback");

      icon.onerror = () => {
        icon.src = "";
        icon.style.display = "none";
        iconFallback.classList.add("iconError");
      };
      icon.classList.add("icon");
      if (t.favIconUrl) {
        icon.src = t.favIconUrl;
      } else {
        icon.src = "";
        icon.style.display = "none";
        iconFallback.classList.add("iconNotFound");
      }
      // title/ url
      const title = document.createElement("span");
      title.classList.add("title");
      if (t.title) {
        title.innerText = t.title;
        title.title = t.url;
      } else if (t.url) {
        title.innerText = t.url;
      }
      title.addEventListener("click", (e) => {
        e.stopPropagation();
        // console.log(w, t.id)
        try {
          chrome.windows.update(Number(w), { focused: true }, () => {
            chrome.tabs.update(t.id, { active: true });
          });
        } catch (error) {
          console.log(error);
          showToast("Unable to activate tab");
        }
      });

      //last accessed
      const time = document.createElement("span");
      const tooltip = document.createElement("span");

      time.classList.add("time");
      tooltip.classList.add("timeTooltip");
      time.appendChild(tooltip);

      time.dataset.lastAccessed = t.lastAccessed;
      time.addEventListener("mouseover", (e) => {
        e.stopPropagation();
        const target = e.target;

        if (target.dataset.lastAccessed == undefined) {
          return;
        }

        const dateTime = new Date(parseInt(target.dataset.lastAccessed));
        const timeDiff = calcTimeDiff(dateTime);

        tooltip.innerHTML = `<div><span class="timeEllapsed"></span>${timeDiff} ago,</div><div><span class="timeDate"></span>${dateTime.toLocaleString()}</div>`;
        tooltip.style.left = `-${tooltip.offsetWidth}px`;
        tooltip.style.top = `calc(-${tooltip.offsetHeight}px / 3)`;
      });
      const spacer = document.createElement("span");
      spacer.classList.add("spacer");

      //only add if the tab has a title or url
      if (title.innerText && title.innerText != document.title) {
        // if (title.innerText) {
        audioWrapper.appendChild(audio);
        holderDiv.appendChild(audioWrapper);
        holderDiv.appendChild(icon);
        holderDiv.appendChild(iconFallback);
        holderDiv.appendChild(title);
        holderDiv.appendChild(spacer);
        holderDiv.appendChild(time);
        span.appendChild(holderDiv);
      }
    }
    if (span.childElementCount > 0) {
      wrapper.appendChild(span);
      const _break = document.createElement("hr");
      wrapper.appendChild(_break);
    }
  }
}

function calcTimeDiff(lastAccessed) {
  const now = new Date();
  const diff = now - lastAccessed;
  let seconds = Math.floor(diff / 1000);
  // console.log(seconds);
  if (seconds < 60) {
    return "A few seconds";
  }
  if (seconds < 180) {
    return "A few minutes";
  }
  // if (seconds < 60 * 60) {
  //   return `${leadingZero(Math.floor(seconds / 60))} minutes`
  // }
  const years = Math.floor(seconds / (60 * 60 * 24 * 30 * 12));
  if (years > 0) {
    seconds = seconds - 60 * 60 * 24 * 30 * 12 * years;
  }
  const months = Math.floor(seconds / (60 * 60 * 24 * 30));
  if (months > 0) {
    seconds = seconds - 60 * 60 * 24 * 30 * months;
  }
  const days = Math.floor(seconds / (60 * 60 * 24));
  if (days > 0) {
    seconds = seconds - 60 * 60 * 24 * days;
  }
  const hours = Math.floor(seconds / (60 * 60));
  if (hours > 0) {
    seconds = seconds - 60 * 60 * hours;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes > 0) {
    seconds = seconds - 60 * minutes;
  }
  return `${years ? `${years} years, ` : ""}${months ? `${months} months, ` : ""}${days ? `${days} days, ` : ""}${hours ? `${leadingZero(hours)}` : ""}${hours && minutes ? "h" : hours ? " hours" : ""}${minutes && hours ? ":" : ""}${minutes ? `${leadingZero(minutes)}` : ""}${hours && minutes ? "m" : minutes ? " minutes" : ""}`;
}
function leadingZero(_num) {
  if (_num < 10) {
    return `0${_num}`;
  }
  return _num;
}
chrome.tabs.onActivated.addListener(debounceLoad);
chrome.tabs.onUpdated.addListener(debounceLoad);
chrome.tabs.onRemoved.addListener(debounceLoad);
debounceLoad();

function debounceLoad() {
  countDebounce++;
  clearTimeout(debounceLoadTimer);
  setTimeout(loadTabs, 300);
}

function logCount() {
  console.log(`Load Calls ${countDebounce}, Actual Loads ${countLoad}`);
}
