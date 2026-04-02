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

let debounce;
const search = document.querySelector('input');
const filterIcon = document.querySelector('.filter');

filterIcon.addEventListener('click', e => {
  search.value = "";
  filterTabs();
})
search.addEventListener('input', e => {
  clearTimeout(debounce);
  debounce = setTimeout(filterTabs, 300);
})


document.querySelector('#reload').onclick = () => { loadTabs() };

function showToast(text = "") {
  if (text == "") return;
  toast.classList.add("show");
  toast.innerText(text);
  setTimeout(() => toast.classList.remove("show"), 2900);
}

async function loadTabs() {
  const _tabs = await chrome.tabs.query({});
  tabs = {};
  for (let t of _tabs) {
    if (tabs[t.windowId]) {
      tabs[t.windowId].push(t);
    } else {
      tabs[t.windowId] = [t]
    }
  }
  document.title = `${_tabs.length} Tabs`
  filterTabs()
}

function filterTabs() {
  const input = search.value;
  let filter = JSON.parse(JSON.stringify(tabs));
  if (input != "") {
    filterIcon.classList.add('off');
    for (const w in filter) {
      for (const t of filter[w]) {
        // console.log(t);>
        if (!(t.title?.includes(input) || t.url?.includes(input))) {
          t["dontShow"] = true;
          console.log(t);
        }
      }
    }
  } else {
    filterIcon.classList.remove('off');
  }
  showTabs(filter);
}

function showTabs(_tabs = tabs) {
  wrapper.innerHTML = "";
  for (const w in _tabs) {
    const span = document.createElement('span');
    span.classList.add('windowGroup');
    for (const t of _tabs[w]) {
      if (t.dontShow) {
        continue;
      }
      // console.log(t);
      const holderDiv = document.createElement('div');
      holderDiv.classList.add('tabElement');

      // span audible/ muted
      const audioWrapper = document.createElement('span');
      audioWrapper.classList.add("audioWrapper");
      const audio = document.createElement('span');
      audio.classList.add("audio");
      if (t.audible) {
        if (t.mutedInfo.muted) {
          audio.classList.add('mute')
        } else {
          audio.classList.add('speaker')
        }
        audio.classList.add('point')
        const muted = !t.mutedInfo.muted;
        audio.addEventListener('click', async (e) => {
          e.stopPropagation();
          await chrome.tabs.update(t.id, { muted });
        })
      }
      // icon
      const icon = document.createElement('img');
      icon.onerror = () => {
        icon.src = "data:image/png;base64,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"
      }
      icon.classList.add('icon');
      if (t.favIconUrl) {
        icon.src = t.favIconUrl;
      } else {
        icon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAEQUlEQVR4AbyYW0gUURjHV03sshVFheJDpWSbL2EmPWRCL/nUu4hKvViIUL0oYdGFLrRgWmq5SpmbiJkSFD1UlmYaiZdVBN28S4mCm4qttWYz2/cfPTa7zuzO6OzK9805c853+Z0zc86cNVC3+r8wcj1EmkiaLqMnqB02sKWqelELuIVSHCFNIz1Jeph0N6mc7KEO2MAWPvBFDGpWJkoBN1C4eNIk0oOk60nVCnzgixiItVFJACWABgqUShpNqpUgVgoFQ2wq5MUbIEaaIO++5h7ERg7ZQJ4A8fJjpLLOGnUgB3JJhpMDTAwJCYkIDAwMkPTSvhELTRJSCjA+ymCIuZ17Pyfr0pVkP0OueNzugIaw8PC49IxzGXr95vCIiH3HxJAEvt2YX5Rd8qTStEYtvpNXmBUTGxfq9jDwuF0WjhgQyz5hfGxsrruzo57jOAc5B4gh+6zWKVNBvmlmZmqQ+tYiAdu2bY9MSklL0ev1wW6BsHCwrQnNYkDs+EJj+ePS5i/NjdVSkIOD/TOmgnslGkDq9PrNoVGG6B1CUtdLLLtlgNjdMb2sXSdAfm6q4XnuDzW6zKSWkBRbSsACJh0DPCBl1d1lGeA4bn6pz9+QAhMD3L8E4a3wJ6TABECcNPCd9AbH+v0FCaYwBsiSKy39BSkASq0iJaD+gNyJGcSZTQmQlI2vIXcDUCqxmjafQmoBiMH4DFIrQJ9BagnoE8hVAzocjuk+a2+d0+nkQCZSTR83AEdFwRVV6fPn+Pih7tld482a4eGBZnJykopFK8gRAE6KI3urY8a6LG2va6srLTzPO403rlUODfV/Ij+n3f5zzNLWWosB0L0WkDYAjlMwxfJjctJaaS5rYA48zzsf5Oc+//5ttOXli5qKh4V5bzU8qo0zQBxOWU7ZEjP0yFRknp2dxRFs2Q731y9fLGt4/24IjeXanCfBJAAi5ldcPOnC34U5zBDOgp7sWJ8SSJvNNsDsJUqBCTOIvl5cPGnwuuBNyamnVf0eOZpwPC0oKAinEoRe8U7euppT2tnRNoFOCRWYGOAsGfSQ+lpcIOfn5zme5913ADCABUzLJ2o0tuMi1j5rj43eO7kRik3V1F0gZRw7WDubQdz/pksj6bLY7faFqgpzxfS08CtOaqTLtiorniDB8IvFEwOizUoXTC8Vi2Jpb53IvpBpTD+VfJb0zFq1ubHeLLVPLmbTITcYlm51Lo+YNTZRRfXXhXwUifvq3rUrNHLv3sit5IycyE3V/+I+g6znDVXgQIX2wiDx27q4MK+Qtq4uyoKcVLiKHCCs4IApR11zBWTW+Uwj/bcCs4Zckjk8AcIBznhpUfeFIjZyyMb2BghHvLQVVNFyNhHrKcVEbCrkRQkgvLHsMdIqusH7gu8kVVUJfOCLGIiFbc1rAKWALBB29xa6MZO+Im0jHSGVEyw02MAWPvBFDDn7Fe3/AAAA//+O4qVdAAAABklEQVQDAKfdqPbRj415AAAAAElFTkSuQmCC'
      }
      // title/ url
      const title = document.createElement('span');
      title.classList.add("title");
      if (t.title) {
        title.innerText = t.title;
        title.title = t.url;
      } else if (t.url) {
        title.innerText = t.url;
      }
      title.addEventListener('click', e => {
        e.stopPropagation();
        console.log(w, t.id)
        chrome.windows.update(parseInt(w), { focused: true }, () => {
          chrome.tabs.update(t.id, { active: true });
        });
      });

      //only add if the tab has a title or url
      if (title.innerText) {
        audioWrapper.appendChild(audio)
        holderDiv.appendChild(audioWrapper);
        holderDiv.appendChild(icon);
        holderDiv.appendChild(title);
        span.appendChild(holderDiv);
      }
    }
    if (span.childElementCount > 0) {
      wrapper.appendChild(span);
      const _break = document.createElement('hr');
      wrapper.appendChild(_break);
    }

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