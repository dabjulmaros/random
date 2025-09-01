const notes = [];

chrome.storage.local.get(["myNotes"]).then((data) => {
  notes.push(...data.myNotes)
  for (const i in notes) {
    createItem(notes[i][0], notes[i][1], i);
  }
});

const wrapper = document.getElementById('wrapper');

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
}

function editText(ele) {
  const textArea = ele.parentElement.querySelector('textarea');
  textArea.disabled = !textArea.disabled
  if (textArea.disabled) {
    notes[ele.parentElement.getAttribute('noteIndex')][1] = textArea.value;
    storeNotes();
  }
}

function addNote() {
  dialog.showModal();
}
function storeNotes() {
  chrome.storage.local.set({ myNotes: notes });
}

function submitNote(ele) {
  if (ele.title === "Add") {
    createItem(newTitle.value, newNote.value);
    notes.push([newTitle.value, newNote.value])
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
  item.setAttribute("noteIndex", _index)
  console.log(_index)

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