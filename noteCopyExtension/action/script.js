const notes = [];

loadNotes();

const wrapper = document.getElementById("wrapper");

const toast = document.getElementById("toast");
let toastTimer;

const dialog = document.querySelector("dialog");
const newTitle = document.getElementById("newTitle");
const newNote = document.getElementById("newNote");

const submitButton = document.getElementById("submitButton");

dialog.addEventListener("click", (e) => {
  const rect = dialog.getBoundingClientRect();
  const isInside =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;

  if (!isInside) {
    dialog.close();
  }
});

document.getElementById("createNoteBtn").onclick = () => addNote();
document.getElementById("cancelButton").onclick = () =>
  submitNote(document.getElementById("cancelButton"));
submitButton.onclick = () => submitNote(submitButton);

const popout = document.getElementById("popout");
if (location.href.includes("popout")) {
  popout.remove();
  document.title = "Copy Quick Notes";
} else {
  popout.addEventListener("click", (e) => {
    window.open(
      location.href + "#popout",
      "",
      "popup,menubar=no,location=no,toolbar=no,noopener,noreferrer,resizable=no,width=550,height=650",
    );
    window.close();
  });
}

function copyText(ele) {
  const textArea = ele.parentElement.querySelector("textarea");
  navigator.clipboard.writeText(textArea.value);
  showToast();
}

function editText(ele, index) {
  // const textArea = ele.parentElement.querySelector("textarea");
  // textArea.readOnly = !textArea.readOnly;
  // const nodeIndex = ele.parentElement.getAttribute("noteIndex");
  // let reload = false;
  newTitle.value = notes[index][0];
  newNote.value = notes[index][1];
  submitButton.title = "Edit";
  submitButton.setAttribute("noteIndex", index);
  dialog.showModal();
  // if (textArea.readOnly) {
  //   notes[nodeIndex][1] = textArea.value;
  //   if (textArea.value === "") {
  //     reload = true;
  //     let temp = notes.splice(nodeIndex);
  //     if (temp.length > 1) {
  //       temp = temp.splice(1);
  //       notes.push(...temp);
  //     }
  //   }
  //   storeNotes(reload);
  // }
}

function addNote() {
  newTitle.value = "";
  newNote.value = "";
  submitButton.title = "Add";
  dialog.showModal();
}

function loadNotes() {
  chrome.storage.local.get(["myNotes"]).then((data) => {
    if (data?.myNotes) {
      notes.push(...data.myNotes);
      for (const i in notes) {
        createItem(notes[i][0], notes[i][1], i);
      }
    }
  });
}

async function storeNotes(reload = false) {
  await chrome.storage.local.set({ myNotes: notes });
  if (reload) {
    notes.splice(0);
    wrapper.innerHTML = "";
    loadNotes();
  }
}

function submitNote(ele) {
  let reload = false;

  if (ele.title === "Add") {
    notes.push([newTitle.value, newNote.value]);
    createItem(newTitle.value, newNote.value, notes.length - 1);
  } else if (ele.title === "Edit") {
    const index = parseInt(submitButton.getAttribute("noteIndex"));
    notes[index] = [newTitle.value, newNote.value];
    submitButton.removeAttribute("noteIndex");
    const item = document.querySelector(
      `.item[noteIndex="${index}"]`,
    ).parentElement;
    item.querySelector("h2").innerText = newTitle.value;
    item.querySelector("textarea").value = newNote.value;

    if (newNote.value === "") {
      reload = true;
      notes.splice(index, 1);
      // let temp = notes.splice(index);
      // if (temp.length > 1) {
      //   temp = temp.splice(1);
      //   notes.push(...temp);
      // }
    }
  }
  storeNotes(reload);

  newTitle.value = "";
  newNote.value = "";

  dialog.close();
}

function createItem(_title, _value, _index) {
  const section = document.createElement("div");
  section.classList.add("section");

  const title = document.createElement("h2");
  title.innerText = _title;

  const item = document.createElement("div");
  item.classList.add("item");
  item.setAttribute("noteIndex", _index);

  const textArea = document.createElement("textarea");
  textArea.readOnly = true;
  textArea.value = _value;

  textArea.addEventListener("focus", () => {
    if (textArea.readOnly) {
      textArea.scrollTop = 0;
    }
  });

  textArea.addEventListener("click", () => {
    // console.log(textArea.readOnly);
    if (textArea.readOnly) {
      copyText(textArea);
    }
  });

  const editButton = document.createElement("button");
  editButton.title = "Edit";
  editButton.className = "icon-btn";
  editButton.innerHTML =
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
  editButton.onclick = () => editText(editButton, _index);

  item.appendChild(textArea);
  // item.appendChild(copyButton);
  item.appendChild(editButton);

  section.appendChild(title);
  section.appendChild(item);

  wrapper.appendChild(section);
}

function showToast(text = "Copied!") {
  toast.classList.add("show");
  toast.innerText = text;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(()=>toast.classList.remove("hide"),490);
  }, 2900);
}

function exportData() {
  chrome.storage.local.get(["myNotes"]).then((data) => {
    if (data?.myNotes) {
      let exportString = "";
      for (const ele of data.myNotes) {
        const title = JSON.stringify(ele[0]);
        const data = JSON.stringify(ele[1]);
        exportString += `${title.substring(1, title.length - 1).replaceAll('\\"', '"')},${data.substring(1, data.length - 1).replaceAll('\\"', '"')}.\n\n`;
      }
      console.log(exportString.trim());
    }
  });
}

async function importData(csv) {
  let data = csv.trim().split(".\n\n");
  data = data.map((e) => {
    const d = e.split(",");
    const title = d[0];
    d.shift();
    const body = d.join(",");
    return [title, body];
  });

  notes.splice(0);
  wrapper.innerHTML = "";
  await chrome.storage.local.set({ myNotes: data });
  loadNotes();
}
