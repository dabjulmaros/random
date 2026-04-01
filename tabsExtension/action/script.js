const popout = document.getElementById("popout");
if (location.href.includes("popout")) {
  popout.remove();
  document.querySelector(".popoutHolder").classList.add("popped");
} else {
  popout.addEventListener("click", (e) => {
    window.open(location.href + "#popout", "", 'popup,menubar=no,location=no,toolbar=no,noopener=no,noreferrer=no,resizable=no,width=550,height=650')
    window.close();
  })
}

const wrapper = document.querySelector('#wrapper');
const toast = document.getElementById("#toast");
let tabs = {};


document.querySelector('#reload').onclick = () => { loadTabs() };

function showToast(text = "") {
  if (text == "") return;
  toast.classList.add("show");
  toast.innerText(text);
  setTimeout(() => toast.classList.remove("show"), 2900);
}

async function loadTabs() {
  tabs = {};
  const _tabs = await chrome.tabs.query({});
  for (let t of _tabs) {
    if (tabs[t.windowId]) {
      tabs[t.windowId].push(t);
    } else {
      tabs[t.windowId] = [t]
    }
  }
  console.log(_tabs);
  console.log(tabs);
  showTabs();
}
function showTabs() {
  wrapper.innerHTML = "";
  for (const w in tabs) {
    const span = document.createElement('span');
    span.classList.add('windowGroup');
    for (const t of tabs[w]) {
      // console.log(t);
      const holderDiv = document.createElement('div');
      holderDiv.classList.add('tabElement');

      // span audible/ muted
      const audio = document.createElement('span');
      audio.classList.add("audio");
      if (t.audible) {
        if (t.mutedInfo.muted) {
          audio.innerText = '🔇'
        } else {
          audio.innerText = '🔊'
        }
        const muted = !t.mutedInfo.muted;
        audio.addEventListener('click', async (e) => {
          e.stopPropagation();
          await chrome.tabs.update(t.id, { muted });
        })
      }
      // icon
      const icon = document.createElement('img');
      icon.classList.add('icon');
      icon.src = t.favIconUrl;
      // title/ url
      const title = document.createElement('span');
      title.classList.add("title");
      title.innerText = t.title;
      title.title = t.url;
      title.addEventListener('click', e => {
        e.stopPropagation();
        console.log(w, t.id)
        chrome.windows.update(parseInt(w), { focused: true }, () => {
          chrome.tabs.update(t.id, { active: true });
        });
      });

      holderDiv.appendChild(audio);
      holderDiv.appendChild(icon);
      holderDiv.appendChild(title);
      wrapper.appendChild(holderDiv);
    }
    const _break = document.createElement('hr');
    wrapper.appendChild(_break);
  }
}
chrome.tabs.onActivated.addListener(loadTabs);
chrome.tabs.onUpdated.addListener(
  loadTabs
)
// chrome.tabs.onRemoved.addListener(
//   loadTabs
// )
loadTabs();