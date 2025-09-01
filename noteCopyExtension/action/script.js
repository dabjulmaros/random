const notes = [];

loadNotes();

const wrapper = document.getElementById('wrapper');

const toast = document.getElementById("toast");

const dialog = document.querySelector('dialog');
const newTitle = document.getElementById('newTitle');
const newNote = document.getElementById('newNote');

document.querySelector('button[title="Create Note"]').onclick = () => addNote();
document.querySelector('button[title="Cancel"]').onclick = () => submitNote(document.querySelector('button[title="Cancel"]'));
document.querySelector('button[title="Add"]').onclick = () => submitNote(document.querySelector('button[title="Add"]'));

const popout = document.getElementById("popout");
if (location.href.includes("popout")) {
  popout.remove();
  document.title = "Copy Quick Notes"
} else {
  popout.addEventListener("click", (e) => {
    window.open(location.href + "#popout", "", 'popup,menubar=no,location=no,toolbar=no,noopener=no,noreferrer=no,resizable=no,width=550,height=650')
  })
}


function copyText(ele) {
  const textArea = ele.parentElement.querySelector('textarea');
  navigator.clipboard.writeText(textArea.value);
  showToast();
}

function editText(ele) {
  const textArea = ele.parentElement.querySelector('textarea');
  textArea.disabled = !textArea.disabled
  const nodeIndex = ele.parentElement.getAttribute('noteIndex');
  let reload = false;
  if (textArea.disabled) {
    notes[nodeIndex][1] = textArea.value;
    if (textArea.value === "") {
      reload = true;
      let temp = notes.splice(nodeIndex);
      if (temp.length > 1) {
        temp = temp.splice(1)
        notes.push(...temp);
      }
    }
    storeNotes(reload);
  }
}

function addNote() {
  dialog.showModal();
}

function loadNotes() {
  chrome.storage.local.get(["myNotes"]).then((data) => {
    if (data?.myNotes) {
      notes.push(...data.myNotes)
      for (const i in notes) {
        createItem(notes[i][0], notes[i][1], i);
      }
    }
  });
}

async function storeNotes(reload = false) {
  await chrome.storage.local.set({ myNotes: notes });
  if (reload) {
    notes.splice(0)
    wrapper.innerHTML = "";
    loadNotes();
  }
}

function submitNote(ele) {
  if (ele.title === "Add") {
    notes.push([newTitle.value, newNote.value])
    createItem(newTitle.value, newNote.value, notes.length - 1);
    storeNotes();
  }
  newTitle.value = "";
  newNote.value = "";
  dialog.close()
}


function createItem(_title, _value, _index) {
  const section = document.createElement('div');
  section.classList.add("section");

  const title = document.createElement('h2');
  title.innerText = _title;

  const item = document.createElement('div');
  item.classList.add('item');
  item.setAttribute("noteIndex", _index);

  const textArea = document.createElement('textarea');
  textArea.disabled = true;
  textArea.value = _value;

  const copyButton = document.createElement('button');
  copyButton.title = "Copy";
  copyButton.innerText = "✂️";
  copyButton.onclick = () => copyText(copyButton);

  const editButton = document.createElement('button');
  editButton.title = "Edit";
  editButton.innerText = "📝";
  editButton.onclick = () => editText(editButton);

  item.appendChild(textArea);
  item.appendChild(copyButton);
  item.appendChild(editButton);

  section.appendChild(title);
  section.appendChild(item);

  wrapper.appendChild(section);

}

function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2900);
}

function exportData() {
  chrome.storage.local.get(["myNotes"]).then((data) => {
    if (data?.myNotes) {
      let exportString = "";
      for (const ele of data.myNotes) {
        const title = JSON.stringify(ele[0]);
        const data = JSON.stringify(ele[1]);
        exportString += `${title.substring(1, title.length - 1).replaceAll('\\"', '"')},${data.substring(1, data.length - 1).replaceAll('\\"', '"')}.\n\n`
      }
      console.log(exportString.trim());
    }
  });
}

function importData(csv) {
  let data = csv.trim().split(".\n\n");
  data = data.map(e => e.split(','));
  data[data.length - 1][1] = data[data.length - 1][1].substr(0, data[data.length][1].length - 1);
  chrome.storage.local.set({ myNotes: data });
}